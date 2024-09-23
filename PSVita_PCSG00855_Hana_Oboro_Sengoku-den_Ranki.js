// ==UserScript==
// @name         [PCSG00855] Hana Oboro ~Sengoku-den Ranki~ (花朧 ～戦国伝乱奇～)
// @version      1.02
// @author       Mansive
// @description  Vita3K
// * Otomate
// * Idea Factory Co., Ltd.
// ==/UserScript==
const { setHook } = require("./libVita3k.js");

// const mainHandler = trans.send(handler, 900+"); lines up name with text better
const mainHandler = trans.send(handler, "200+");
const dictHandler = trans.send(handler2, "200+");

setHook({
  // 0x80014e78: mainHandler.bind_(null, 8, "name"),
  0x80037600: mainHandler.bind_(null, 6, "text"),
  0x80036580: mainHandler.bind_(null, 6, "choice"),
  0x801a2ada: dictHandler.bind_(null, 0, "dict word"),
  0x801a2ba8: dictHandler.bind_(null, 0, "dict meaning"),
});

let previous = "";

function handler(regs, index, hookname) {
  const address = regs[index].value;

  // console.log("onEnter: ", hookname);
  // console.log(hexdump(address, { header: false, ansi: false, length: 0x50 }));

  const s = address.readUtf8String();

  if (s === "") {
    return null;
  }

  return s;
}

function handler2(regs, index, hookname) {
  const address = regs[index].value;
  let s = address.readUtf8String();

  if (s === previous) {
    return null;
  }
  previous = s;

  // fix up dictionary text
  s = s
    .replace(/Χ/g, "、")
    .replace(/Δ/g, "。")
    .replace(/Λ/g, "っ")
    .replace(/《/g, "（")
    .replace(/》/g, "）")
    .replace(/∫/g, "「")
    .replace(/∨/g, "」")
    .replace(/∴/g, "『")
    .replace(/∵/g, "』")
    .replace(/П/g, "【")
    .replace(/Ц/g, "】");

  return s;
}

trans.replace((s) => {
  return s.replace(/#n\u3000*/gu, "").replace(/#\w.+?]/g, "");
});
