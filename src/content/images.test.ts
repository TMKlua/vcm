import { describe, it, expect } from "vitest";

import {
  MAX_IMAGE_BYTES,
  collectDataUrls,
  imagePathname,
  parseDataUrl,
  replaceDataUrls,
} from "./images";

/** A 1-byte payload is enough: these helpers only care about bytes, not pixels. */
const TINY_WEBP = `data:image/webp;base64,${Buffer.from("hello").toString("base64")}`;

describe("parseDataUrl", () => {
  it("decodes an allowed image type", () => {
    const result = parseDataUrl(TINY_WEBP);

    expect(result).not.toBeNull();
    expect(result?.mime).toBe("image/webp");
    expect(result?.ext).toBe("webp");
    expect(result?.bytes.toString()).toBe("hello");
  });

  it("maps jpeg and png to their extensions", () => {
    const jpeg = `data:image/jpeg;base64,${Buffer.from("a").toString("base64")}`;
    const png = `data:image/png;base64,${Buffer.from("a").toString("base64")}`;

    expect(parseDataUrl(jpeg)?.ext).toBe("jpg");
    expect(parseDataUrl(png)?.ext).toBe("png");
  });

  it("rejects disallowed types, plain strings and empty payloads", () => {
    expect(parseDataUrl("data:image/gif;base64,AAAA")).toBeNull();
    expect(parseDataUrl("data:text/plain;base64,AAAA")).toBeNull();
    expect(parseDataUrl("/images/hero.jpg")).toBeNull();
    expect(parseDataUrl("data:image/webp;base64,")).toBeNull();
  });

  it("rejects a payload above the per-image ceiling", () => {
    const huge = `data:image/webp;base64,${Buffer.alloc(MAX_IMAGE_BYTES + 1).toString("base64")}`;
    expect(parseDataUrl(huge)).toBeNull();
  });
});

describe("imagePathname", () => {
  it("is deterministic for identical bytes", () => {
    const a = imagePathname(Buffer.from("same"), "webp");
    const b = imagePathname(Buffer.from("same"), "webp");
    expect(a).toBe(b);
  });

  it("differs for different bytes and keeps the extension", () => {
    const a = imagePathname(Buffer.from("one"), "webp");
    const b = imagePathname(Buffer.from("two"), "webp");

    expect(a).not.toBe(b);
    expect(a).toMatch(/^images\/[0-9a-f]{16}\.webp$/);
  });
});

describe("collectDataUrls", () => {
  it("finds inline images at any depth and de-duplicates them", () => {
    const tree = {
      club: { logo: TINY_WEBP },
      teams: [{ image: TINY_WEBP }, { image: "/images/team.jpg" }],
      nested: { deep: { deeper: [{ photo: "data:image/png;base64,QQ==" }] } },
    };

    const found = collectDataUrls(tree);

    expect(found.size).toBe(2);
    expect(found.has(TINY_WEBP)).toBe(true);
  });

  it("returns nothing for content without inline images", () => {
    expect(collectDataUrls({ a: "/images/x.jpg", b: [1, null, true] }).size).toBe(0);
  });
});

describe("replaceDataUrls", () => {
  it("swaps mapped strings anywhere in the tree without mutating the input", () => {
    const tree = {
      club: { logo: TINY_WEBP },
      teams: [{ image: TINY_WEBP }, { image: "/images/team.jpg" }],
    };
    const map = new Map([[TINY_WEBP, "https://cdn.test/images/abc.webp"]]);

    const result = replaceDataUrls(tree, map);

    expect(result.club.logo).toBe("https://cdn.test/images/abc.webp");
    expect(result.teams[0].image).toBe("https://cdn.test/images/abc.webp");
    expect(result.teams[1].image).toBe("/images/team.jpg");
    // Input untouched.
    expect(tree.club.logo).toBe(TINY_WEBP);
  });

  it("leaves values alone when the map is empty", () => {
    const tree = { a: "x", b: [1, 2] };
    expect(replaceDataUrls(tree, new Map())).toEqual(tree);
  });
});
