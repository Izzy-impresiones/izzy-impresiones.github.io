"""Descarga las fotos de los productos (y el logo) dentro del repositorio,
así la página no depende de la web anterior. Lo corre GitHub automáticamente."""
import json, os, re, urllib.request, urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "productos.json")
LOGO_URL = "https://izzy-impresiones-3d.robertito20003000400.chatgpt.site/brand/izzy-mark.png"
UA = {"User-Agent": "Mozilla/5.0 (izzy-web image mirror)"}


def bajar(url, destino):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        datos = r.read()
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    with open(destino, "wb") as f:
        f.write(datos)


def main():
    logo = os.path.join(ROOT, "brand", "izzy-mark.png")
    if not os.path.exists(logo):
        try:
            bajar(LOGO_URL, logo)
            print("logo ok")
        except Exception as e:
            print("logo error:", e)

    with open(DATA, encoding="utf-8") as f:
        productos = json.load(f)

    cambios = 0
    for p in productos:
        nuevas = []
        for i, url in enumerate(p.get("imagenes", []), 1):
            if not url.startswith("http"):
                nuevas.append(url)
                continue
            ext = os.path.splitext(urllib.parse.urlparse(url).path)[1].lower() or ".jpg"
            if not re.fullmatch(r"\.(png|jpe?g|webp|gif)", ext):
                ext = ".jpg"
            rel = f"img/productos/{p['slug']}-{i}{ext}"
            try:
                bajar(url, os.path.join(ROOT, rel))
                nuevas.append(rel)
                cambios += 1
            except Exception as e:
                print("error", p["slug"], url, e)
                nuevas.append(url)
        p["imagenes"] = nuevas

    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(productos, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"{cambios} fotos copiadas")


if __name__ == "__main__":
    main()
