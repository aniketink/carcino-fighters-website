/* eslint react/no-unescaped-entities: "off" */
"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Award,
  CalendarCheck,
  PaintBucket,
  UserCheck,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Footer } from "@/components/footer";
import { motion, MotionConfig, useScroll, useTransform } from "framer-motion";
import { getAllDocs } from "@/lib/docsRepository";
// import { useState } from "react";
import ShinyText from "@/components/ShinyText";
import { useTranslation } from "@/hooks/useTranslation";

const easeSoft = [0.33, 1, 0.68, 1] as const;

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easeSoft },
  },
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: easeSoft },
  },
};

const MotionLabel = motion(Label);

interface Article {
  id: string;
  slug: string;
  title: string;
  author: string | null;
  content: string;
  title_hi?: string | null;
  title_bn?: string | null;
}

// interface Position {
//   x: number;
//   y: number;
// }

export default function Home() {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const heroRef = React.useRef<HTMLDivElement | null>(null);
  const articlesRef = React.useRef<HTMLDivElement | null>(null);
  const { t, language } = useTranslation();

  // Parallax: move background slower than scroll within hero section
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  // Parallax blobs for Articles section
  const { scrollYProgress: articlesProgress } = useScroll({
    container: containerRef,
    target: articlesRef,
    offset: ["start end", "end start"],
  });
  const yBlob1 = useTransform(articlesProgress, [0, 1], [400, -400]);
  // const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  // const [opacity, setOpacity] = useState<number>(0);

  React.useEffect(() => {
    (async () => {
      const docs = await getAllDocs();
      setArticles(docs);
      setLoading(false);
    })();
  }, []);

  const featuredArticles = React.useMemo<Article[]>(() => {
    if (articles.length === 0) return [];
    return [...articles].sort(() => Math.random() - 0.5).slice(0, 6);
  }, [articles]);

  return (
    <div
      ref={containerRef}
      className=" flex flex-col relative lg:block lg:h-screen w-screen overflow-y-scroll overflow-x-hidden items-start gap-20 bg-background"
    >
      <MotionConfig transition={{ duration: 1 }}>
        <motion.div
          ref={heroRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={staggerContainer}
          className="h-screen flex bg-transparent flex-col mb-10 items-center gap-[12rem] justify-center w-full overflow-y-hidden"
        >
          <motion.div
            style={{ y }}
            className="absolute inset-0 will-change-transform"
            aria-hidden
            initial="hidden"
            whileInView="visible"
            variants={fadeScale}
          >
            <Image
              src={`/landing/Background.png`}
              height={888}
              width={1440}
              alt="background"
              className="object-cover w-full h-full"
              priority
            />

            <div className="absolute inset-0 bg-[#471F77]/52" />
            <div className="absolute inset-0 bg-[#000000]/64" />
          </motion.div>

          <motion.div
            className="flex z-10 flex-col w-full justify-self-center self-center items-center gap-11"
            variants={staggerContainer}
          >
            <ShinyText
              text={t.home.heroTitle}
              disabled={false}
              speed={4}
              className="text-4xl lg:text-5xl text-center xl:text-7xl font-panchang font-bold"
            />
            <motion.span
              className="font-space_grotesk text-lg max-sm:px-6 sm:max-w-[35%] w-full text-center"
              variants={fadeUp}
            >
              {t.home.heroSubtitle}
            </motion.span>
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex"
            >
              <Button
                asChild
                variant={`ghost`}
                className="px-6 py-5 backdrop-blur-sm border border-foreground/30 bg-foreground/10 rounded-full inset-shadow-[0_0_15px_6px] inset-shadow-foreground/10 hover:scale-[105%] transition-all duration-300 font-giest font-medium"
              >
                <Link href="/article" className="">
                  {t.home.readDocuments}{" "}
                  <ArrowUpRight className="transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Articles */}
        <motion.div
          ref={articlesRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="z-10 font-giest flex flex-col lg:gap-8 md:gap-4 gap-2 items-center text-center lg:text-left justify-start w-full sm:max-w-[70%] mx-auto h-fit lg:px-14 md:px-10 px-6 pb-6 py-7 relative"
        >
          <MotionLabel
            className="border p-3 rounded-full font-space_grotesk text-base text-foreground"
            variants={fadeUp}
          >
            {t.home.researchDevelopment}
          </MotionLabel>
          <motion.h1
            className="text-2xl font-giest text-foreground "
            variants={fadeUp}
          >
            {t.home.ourArticles}
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground font-space_grotesk"
            variants={fadeUp}
          >
            {t.home.articlesDesc}
          </motion.p>
          {/* subtle parallax blobs behind the grid */}

          <motion.div
            className="relative justify-center z-10 grid lg:grid-flow-col lg:grid-rows-2 gap-3 py-6 w-screen"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            key={loading ? "skeleton" : "cards"}
            variants={staggerContainer}
          >
            <div className="pointer-events-none absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                initial={false}
                style={{ y: yBlob1 }}
                className="aspect-square w-[80rem] blur-3xl opacity-35 will-change-transform"
                aria-hidden
              >
                <div className="w-full h-full rounded-full bg-[radial-gradient(closest-side,rgba(213,176,255,0.8),transparent)]" />
              </motion.div>
            </div>
            {loading ? (
              <div className="col-span-full flex flex-col items-center gap-4 py-16">
                <motion.div
                  className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                  aria-hidden
                />
                <span className="font-space_grotesk text-sm text-muted-foreground">
                  {t.home.loadingArticles}
                </span>
              </div>
            ) : articles.length === 0 ? (
              <div className="col-span-full text-center text-lg text-muted-foreground">
                {t.home.noArticles}
              </div>
            ) : (
              featuredArticles.map((article) => {
                const title = language === 'hi' ? article.title_hi : language === 'bn' ? article.title_bn : article.title;
                const displayTitle = title || article.title;

                return (
                  <motion.div
                    key={article.id}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.55, ease: easeSoft },
                      },
                    }}
                    layout
                    whileHover={{ y: -4, scale: 1.015 }}
                  >
                    <CardContainer className="w-xs sm:w-sm px-4 my-2 overflow-hidden aspect-[3/2]">
                      <CardBody className="inset-shadow-[0_0_10px_10px] inset-shadow-foreground/2 relative group/card aspect-3/2 bg-background/20 backdrop-blur-sm border-accent w-full h-full rounded-[55px] p-[30px] px-[45px] border">
                        <div className="flex flex-col gap-4 h-full justify-between">
                          <Link
                            href={`/article/${article.slug}`}
                            className="my-auto"
                          >
                            <CardItem
                              translateZ="20"
                              className="flex flex-col gap-2 h-full items-center"
                            >
                              <div className="text-primary bg-primary/10 px-2 rounded border-primary border/20 w-fit mb-2 text-xs font-medium">
                                {t.home.researchArticle}
                              </div>
                              <h2 className="text-lg lg:text-2xl md:text-xl font-giest text-foreground mb-2 line-clamp-2 text-center">
                                {displayTitle}
                              </h2>
                              <div className="flex items-center gap-2 mb-2">
                                <p className="text-muted-foreground text-sm line-clamp-3">
                                  {t.home.authoredBy}{" "}
                                  {article.author ?? t.home.anonymous}
                                </p>
                              </div>
                              <p className="text-sm text-primary flex flex-row items-center gap-1 font-medium hover:underline justify-center">
                                {t.home.viewArticle} <ArrowUpRight size={14} />
                              </p>
                            </CardItem>
                          </Link>
                        </div>
                      </CardBody>
                    </CardContainer>
                  </motion.div>
                );
              })
            )}
          </motion.div>
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -2, scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex"
          >
            <Button
              asChild
              variant={`ghost`}
              className="px-5 py-3 backdrop-blur-sm border border-foreground/30 bg-foreground/10 rounded-full inset-shadow-[0_0_15px_6px] inset-shadow-foreground/10 transition-all duration-300 font-giest font-medium"
            >
              <Link href="/article">
                {t.home.readMoreInsights} <ArrowUpRight />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Featured */}
        {/* Mobile Quotation (hidden in pc) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="flex flex-col items-center gap-5 w-full h-fit justify-center lg:hidden py-16 z-10"
        >
          <motion.h2
            className="font-giest px-3 text-lg text-center font-semibold"
            variants={fadeUp}
          >
            “The human spirit was built to outlast despair. So, live life to the
            fullest and don't think about things too much.”
          </motion.h2>
          <motion.p
            className="font-giest
           text-center"
            variants={fadeUp}
          >
            Rajannya Das <br /> Founder & CEO
          </motion.p>
        </motion.div>

        {/* General Featured Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={staggerContainer}
          className="z-10 flex flex-col lg:gap-6 md:gap-4 gap-4 items-center lg:items-start text-center lg:text-left justify-center w-full lg:w-fit h-fit max-h-[1200px] lg:px-14 md:px-10 px-6 pb-6"
        >
          <MotionLabel
            className="border p-3 rounded-full font-space_grotesk text-base text-foreground"
            variants={fadeUp}
          >
            {t.home.whyTrustUs}
          </MotionLabel>
          <motion.h1
            className="text-2xl font-giest text-foreground"
            variants={fadeUp}
          >
            {t.home.trustTitle}
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground font-space_grotesk"
            variants={fadeUp}
          >
            {t.home.trustDesc}
          </motion.p>
          <div className="flex flex-row items-center justify-center w-full h-fit">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              className="grid lg:grid-flow-col lg:grid-rows-2 gap-7 pt-7 max-w-[400px] lg:max-w-[50%] h-fit"
            >
              <motion.div variants={fadeUp}>
                <Card className="animate-floaty lg:border-0 shadow-none bg-transparent">
                  <CardHeader className="flex flex-col items-center lg:items-start gap-2">
                    <div className="animate-floaty">
                      <Award />
                    </div>
                    <p className="text-xl lg:text-2xl font-giest">
                      {t.home.verifiedResearch}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="font-giest text-muted-foreground text-sm lg:text-lg">
                      {t.home.verifiedResearchDesc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Card className="animate-floaty delay-400 lg:border-0 shadow-none bg-transparent">
                  <CardHeader className="flex flex-col items-center lg:items-start gap-1">
                    <div
                      className="animate-floaty"
                      style={{ animationDelay: "0.15s" }}
                    >
                      <CalendarCheck />
                    </div>
                    <p className="text-xl lg:text-2xl font-giest">
                      {t.home.upToDate}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="font-giest text-muted-foreground lg:text-lg">
                      {t.home.upToDateDesc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Card className="animate-floaty delay-800 lg:border-0 shadow-none bg-transparent">
                  <CardHeader className="flex flex-col items-center lg:items-start gap-2">
                    <div
                      className="animate-floaty"
                      style={{ animationDelay: "0.3s" }}
                    >
                      <PaintBucket />
                    </div>
                    <p className="text-xl lg:text-2xl font-giest">
                      {t.home.madeForEveryone}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="font-giest text-muted-foreground lg:text-lg">
                      {t.home.madeForEveryoneDesc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Card className="animate-floaty delay-[1200] lg:border-0 shadow-none bg-transparent">
                  <CardHeader className="flex flex-col items-center lg:items-start gap-2">
                    <div
                      className="animate-floaty"
                      style={{ animationDelay: "0.45s" }}
                    >
                      <UserCheck />
                    </div>
                    <p className="text-xl lg:text-2xl font-giest">
                      {t.home.runByStudents}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="font-giest text-muted-foreground lg:text-lg">
                      {t.home.runByStudentsDesc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
            <div className="lg:flex flex-col items-center gap-7 max-w-[50%] w-full h-full justify-center hidden">
              <h2 className="font-giest text-lg font-semibold max-w-[60%] text-center">
                “The human spirit was built to outlast despair. So, live life to
                the fullest and don't think about things too much.”
              </h2>
              <p className="font-giest text-center">
                Rajannya Das <br /> Founder & Managing Director
              </p>
            </div>
          </div>
        </motion.div>

        {/* Call to action  */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="z-10 font-giest text-foreground flex flex-col lg:gap-6 md:gap-4 gap-2 items-center text-center xl:text-left justify-start w-full h-fit lg:px-14 md:px-10 px-6 pb-6 lg:py-18"
        >
          <div className="w-full flex flex-row items-center justify-between bg-background/20 border rounded-4xl relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-180 blur-3xl from-[#F0F0FF]/30 via-[#D5B0FF]/30 to-[#F0F0FF]/30 dark:from-[#2C2C2C]/30 dark:via-[#471F77]/30 dark:to-[#2C2C2C]/30"></div>
            <div className="text-whte flex flex-col items-center xl:items-start xl:max-w-[60%] justify-center gap-6 w-full h-fit lg:px-14 md:px-10 px-6 py-10 sm:py-14 md:py-18 lg:py-20 relative z-10">
              <h1 className="text-5xl">{t.home.ctaTitle}</h1>
              <p className="text-lg">
                {t.home.ctaDesc}
              </p>
              <div className="flex flex-row gap-3">
                <Button
                  asChild
                  variant={`ghost`}
                  className="px-6 py-5 backdrop-blur-sm border border-foreground/30 bg-foreground/10 rounded-full inset-shadow-[0_0_15px_6px] inset-shadow-foreground/10 transition-all duration-300 font-giest font-medium"
                >
                  <Link href="/internship/writer">
                    {t.home.writingTeam} <ArrowUpRight />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={`ghost`}
                  className="px-6 py-5 backdrop-blur-sm border border-foreground/30 bg-foreground/10 rounded-full inset-shadow-[0_0_15px_6px] inset-shadow-foreground/10 transition-all duration-300 font-giest font-medium"
                >
                  <Link href="/internship/tech">
                    {t.home.devDesign} <ArrowUpRight />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden xl:inline relative z-10">
              <Image
                src={`/Shape.png`}
                height={590}
                width={559.63}
                alt=""
                className="object-cover h-full"
              />
            </div>
          </div>
        </motion.div>
      </MotionConfig>

      {/* Footer */}
      <Footer></Footer>
    </div>
  );
}
