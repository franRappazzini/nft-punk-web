import Head from "next/head";

interface Props {
  children: JSX.Element;
  title?: string;
}

const Layout = ({ children, title = "NFT Punk" }: Props) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <header></header>

      <main>{children}</main>

      <footer></footer>
    </>
  );
};

export default Layout;
