import React, { useRef } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { gsap } from "gsap";
import TypeIt from "typeit-react";

function HeroImage() {
  const heroImg = useRef(null);

  return (
    <img
      ref={heroImg}
      className="bg-gray-100 shadow-lg rounded-lg"
      src="/img/csb_illustration_01.svg"
      alt="csb_illustration_01"
      onMouseMove={(e) => {
        const node = heroImg.current;
        const x = e.pageX - node.offsetLeft;
        const y = e.pageY - node.offsetTop;

        const px = x / node.offsetWidth;
        const py = y / node.offsetHeight;
        const xx = -5 + 10 * px;
        const yy = 5 - 10 * py;

        gsap.to(node, {
          duration: 0.5,
          rotationY: xx,
          rotationX: yy,
          rotationZ: 0,
          transformPerspective: 1000,
          ease: "power1.out",
        });
      }}
      onMouseOut={(e) => {
        const node = heroImg.current;
        gsap.to(node, {
          duration: 0.5,
          rotationY: 0,
          rotationX: 0,
          rotationZ: 0,
          transformPerspective: 1000,
          ease: "power1.out",
        });
      }}
    />
  );
}

function Typer() {
  return (
    <TypeIt
      options={{ loop: true }}
      getBeforeInit={(instance) => {
        instance
          .type(
            "Own Your <strong class='text-primary'>Social Activities!</strong>"
          )
          .pause(2000);

        const altTexts = [
          "Profiles",
          "Follow Lists",
          "Notes",
          "Articles",
          "Likes",
          "Comments",
          "Collections",
        ];

        altTexts.forEach((t) => {
          instance
            .delete(".text-primary")
            .type(`<strong class='text-primary'>${t}!</strong>`)
            .pause(1500);
        });

        return instance;
      }}
    />
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <>
      <header className="hero hero--primary min-h-screen bg-accent">
        <div className="container hero-content flex-col bg-accent text-center item-center gap-6">
          <h1 className="hero__title text-6xl sm:text-8xl font-semibold mt-4 text-primary">
            {siteConfig.title}
          </h1>
          <p className="hero__subtitle text-xl sm:text-4xl font-bold">
            {/* {siteConfig.tagline} */}
            <Typer />
          </p>


          <HeroImage />

          <p
            className="text-xl sm:text-2xl md:text-4xl font-medium text-center "
            style={{ lineHeight: "1.5em" }}
          >
            <span className="text-primary font-bold">Crossbell</span> is a platform for owning your social activities, 
            <br/>composed of an EVM-compatible blockchain and a set of smart contracts.
          </p>

          <Link className="btn btn-lg btn-primary" to="/docs/intro">
            Get Started
          </Link>
        </div>
      </header>
    </>
  );
}

function Intro() {
  return <section></section>;
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title} - ${siteConfig.tagline}`}
      description={`${siteConfig.tagline}`}
    >
      <HomepageHeader />

      {/* <main>
        <Intro />
      </main> */}
    </Layout>
  );
}
