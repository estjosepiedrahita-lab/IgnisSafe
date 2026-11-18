/* ==========================================================================
   IGNIS SAFE · Motor de la U-Net de fuego (inferencia en el navegador)
   Lee los pesos de model/unet_fuego.js (window.IGNIS_UNET) y segmenta una imagen:
   devuelve la probabilidad de fuego de cada píxel (256 × 256).

   Arquitectura (la misma del entrenamiento):
     Bloque(entrada→salida) = Conv3×3 → BatchNorm → ReLU → Conv3×3 → BatchNorm → ReLU
     Codificador e1..e4 (16, 32, 64, 128 canales) con MaxPool 2×2 entre niveles
     Cuello (256 canales) → 4 etapas de ConvTranspose 2×2 + concatenar con el
     codificador + Bloque → Conv 1×1 → Sigmoide
   La BatchNorm ya viene fusionada con las convoluciones (equivale en inferencia).

   Ajustes por si tu entrenamiento fue distinto:
   ========================================================================== */
(function () {
  'use strict';

  var CONFIG = {
    /* Normalización de la entrada: valor = (pixel/255 - mean) / std.
       0–1 sin más:        mean [0,0,0],            std [1,1,1]
       ImageNet:           mean [0.485,0.456,0.406], std [0.229,0.224,0.225] */
    mean: [0, 0, 0],
    std: [1, 1, 1],
    /* Orden al concatenar en el decodificador:
       'up-first'   → torch.cat([sube, codificador])
       'skip-first' → torch.cat([codificador, sube]) */
    concat: 'up-first'
  };

  var net = null;       // pesos desempaquetados
  var loading = null;

  function b64ToFloat32(b64) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Float32Array(bytes.buffer);
  }

  function loadWeights() {
    if (net) return net;
    var pack = window.IGNIS_UNET;
    if (!pack) throw new Error('No se encontró model/unet_fuego.js');
    var all = b64ToFloat32(pack.b64);
    var w = {}, off = 0;
    pack.meta.layers.forEach(function (l) {
      var n = l.shape.reduce(function (a, b) { return a * b; }, 1);
      w[l.name] = all.subarray(off, off + n);
      w[l.name].shape = l.shape;
      off += n;
    });
    net = { w: w, meta: pack.meta };
    return net;
  }

  var tick = function () { return new Promise(function (r) { setTimeout(r, 0); }); };

  /* Conv 3×3 (relleno 1) + sesgo + ReLU. `ins` = lista de [tensor, canales] (se concatenan). */
  async function conv3(ins, wgt, bias, outC, H, W, onStep) {
    var out = new Float32Array(outC * H * W);
    var HW = H * W, inC = 0, i;
    for (i = 0; i < ins.length; i++) inC += ins[i][1];
    for (var oc = 0; oc < outC; oc++) {
      var o = oc * HW;
      out.fill(bias[oc], o, o + HW);
      var cbase = 0;
      for (var k = 0; k < ins.length; k++) {
        var src = ins[k][0], cn = ins[k][1];
        for (var c = 0; c < cn; c++) {
          var wb = (oc * inC + cbase + c) * 9, sb = c * HW;
          for (var ky = 0; ky < 3; ky++) {
            var y0 = ky === 0 ? 1 : 0, y1 = ky === 2 ? H - 1 : H;
            for (var kx = 0; kx < 3; kx++) {
              var wv = wgt[wb + ky * 3 + kx];
              if (wv === 0) continue;
              var x0 = kx === 0 ? 1 : 0, x1 = kx === 2 ? W - 1 : W, dx = kx - 1;
              for (var y = y0; y < y1; y++) {
                var orow = o + y * W, irow = sb + (y + ky - 1) * W + dx;
                for (var x = x0; x < x1; x++) out[orow + x] += wv * src[irow + x];
              }
            }
          }
        }
        cbase += cn;
      }
      for (var p = o; p < o + HW; p++) if (out[p] < 0) out[p] = 0;
      if ((oc & 3) === 3) { onStep(); await tick(); }
    }
    return out;
  }

  function maxpool(src, C, H, W) {
    var h = H >> 1, w = W >> 1, out = new Float32Array(C * h * w);
    for (var c = 0; c < C; c++) {
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var i = c * H * W + 2 * y * W + 2 * x;
          var a = src[i], b = src[i + 1], d = src[i + W], e = src[i + W + 1];
          if (b > a) a = b; if (d > a) a = d; if (e > a) a = e;
          out[c * h * w + y * w + x] = a;
        }
      }
    }
    return out;
  }

  /* ConvTranspose 2×2, paso 2. Pesos [entrada][salida][2][2]. */
  function upconv(src, wgt, bias, inC, outC, H, W) {
    var H2 = H * 2, W2 = W * 2, out = new Float32Array(outC * H2 * W2);
    for (var oc = 0; oc < outC; oc++) out.fill(bias[oc], oc * H2 * W2, (oc + 1) * H2 * W2);
    for (var ic = 0; ic < inC; ic++) {
      for (var oc2 = 0; oc2 < outC; oc2++) {
        var wb = (ic * outC + oc2) * 4;
        for (var y = 0; y < H; y++) {
          for (var x = 0; x < W; x++) {
            var v = src[ic * H * W + y * W + x];
            var o = oc2 * H2 * W2 + 2 * y * W2 + 2 * x;
            out[o] += v * wgt[wb];
            out[o + 1] += v * wgt[wb + 1];
            out[o + W2] += v * wgt[wb + 2];
            out[o + W2 + 1] += v * wgt[wb + 3];
          }
        }
      }
    }
    return out;
  }

  /* Bloque: dos convoluciones. `ins` se concatena en la primera. */
  async function block(name, ins, outC, H, W, onStep) {
    var w = net.w;
    var a = await conv3(ins, w[name + '.a.w'], w[name + '.a.b'], outC, H, W, onStep);
    return conv3([[a, outC]], w[name + '.b.w'], w[name + '.b.b'], outC, H, W, onStep);
  }

  function pair(up, skip, c) {
    return CONFIG.concat === 'skip-first' ? [[skip, c], [up, c]] : [[up, c], [skip, c]];
  }

  /* Red completa. `input` = Float32Array [3, S, S] ya normalizada. Devuelve probabilidades [S*S]. */
  async function forward(input, S, onProgress) {
    var w = net.w, total = 4 * (4 + 8 + 16 + 32 + 64) / 4 * 1, done = 0;
    // pasos totales aproximados (cada 4 canales de salida = 1 paso)
    total = (16 + 16 + 32 + 32 + 64 + 64 + 128 + 128 + 256 + 256 + 128 + 128 + 64 + 64 + 32 + 32 + 16 + 16) / 4;
    var step = function () { done++; if (onProgress) onProgress(Math.min(done / total, 1)); };

    var e1 = await block('e1', [[input, 3]], 16, S, S, step);
    var e2 = await block('e2', [[maxpool(e1, 16, S, S), 16]], 32, S / 2, S / 2, step);
    var e3 = await block('e3', [[maxpool(e2, 32, S / 2, S / 2), 32]], 64, S / 4, S / 4, step);
    var e4 = await block('e4', [[maxpool(e3, 64, S / 4, S / 4), 64]], 128, S / 8, S / 8, step);
    var m = await block('cuello', [[maxpool(e4, 128, S / 8, S / 8), 128]], 256, S / 16, S / 16, step);

    var u4 = upconv(m, w['u4.w'], w['u4.b'], 256, 128, S / 16, S / 16);
    var d4 = await block('d4', pair(u4, e4, 128), 128, S / 8, S / 8, step);
    var u3 = upconv(d4, w['u3.w'], w['u3.b'], 128, 64, S / 8, S / 8);
    var d3 = await block('d3', pair(u3, e3, 64), 64, S / 4, S / 4, step);
    var u2 = upconv(d3, w['u2.w'], w['u2.b'], 64, 32, S / 4, S / 4);
    var d2 = await block('d2', pair(u2, e2, 32), 32, S / 2, S / 2, step);
    var u1 = upconv(d2, w['u1.w'], w['u1.b'], 32, 16, S / 2, S / 2);
    var d1 = await block('d1', pair(u1, e1, 16), 16, S, S, step);

    var ow = w['out.w'], ob = w['out.b'][0], HW = S * S, prob = new Float32Array(HW);
    for (var p = 0; p < HW; p++) {
      var s = ob;
      for (var c = 0; c < 16; c++) s += ow[c] * d1[c * HW + p];
      prob[p] = 1 / (1 + Math.exp(-s));
    }
    if (onProgress) onProgress(1);
    return prob;
  }

  /* Imagen (canvas/img/bitmap) → tensor normalizado [3,S,S] (se escala a S×S) */
  function toTensor(source, S) {
    var cv = document.createElement('canvas');
    cv.width = S; cv.height = S;
    var ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(source, 0, 0, S, S);
    var px = ctx.getImageData(0, 0, S, S).data, HW = S * S;
    var t = new Float32Array(3 * HW);
    for (var i = 0; i < HW; i++) {
      for (var c = 0; c < 3; c++) t[c * HW + i] = (px[i * 4 + c] / 255 - CONFIG.mean[c]) / CONFIG.std[c];
    }
    return t;
  }

  /* API pública */
  window.IgnisUNet = {
    CONFIG: CONFIG,
    forward: async function (tensor, S, onProgress) { loadWeights(); return forward(tensor, S, onProgress); },
    toTensor: toTensor,

    /* Analiza una imagen. Resuelve { size, prob, mask, fraction, detected, threshold } */
    analyze: async function (source, onProgress) {
      loadWeights();
      var S = net.meta.size, thr = net.meta.threshold;
      var prob = await forward(toTensor(source, S), S, onProgress);
      var mask = new Uint8Array(S * S), n = 0;
      for (var i = 0; i < prob.length; i++) { if (prob[i] >= thr) { mask[i] = 1; n++; } }
      var fraction = n / (S * S);
      return {
        size: S, prob: prob, mask: mask, fraction: fraction, pixels: n, threshold: thr,
        detected: fraction >= window.IgnisUNet.MIN_FRACTION
      };
    },
    /* Área mínima (fracción de la imagen) para decir que "hay fuego": evita falsos positivos de unos pocos píxeles */
    MIN_FRACTION: 0.005
  };
})();
