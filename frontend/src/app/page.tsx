import Image from "next/image";
import ListProjects from "./components/ListProjects/ListProjects";
import Nav from "./components/Nav/Nav";
import Footer from "./components/Footer/Footer";

export default function Home() {
  return(
    <>
      <Nav/>
      <ListProjects/>
      <Footer/>
    </>
  );
}
