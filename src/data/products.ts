import { Product } from "../types";

const casaImage = new URL("../../img/casa.jpg", import.meta.url).href;
const civicImage = new URL(
  "../../img/Novo Honda Civic 2016 (2).jpg",
  import.meta.url,
).href;
const sitioImage = new URL("../../img/sitio.jpg", import.meta.url).href;

export const products: Product[] = [
  {
    id: "casa",
    title: "Casa 220m²",
    description:
      "Some quick example text to build on the card title and make up the bulk of the card's content.",
    price: 250000,
    image: casaImage,
  },
  {
    id: "civic",
    title: "Civic 2016",
    description:
      "Some quick example text to build on the card title and make up the bulk of the card's content.",
    price: 45000,
    image: civicImage,
  },
  {
    id: "sitio",
    title: "Sítio 1000m²",
    description:
      "Some quick example text to build on the card title and make up the bulk of the card's content.",
    price: 150000,
    image: sitioImage,
  },
];
