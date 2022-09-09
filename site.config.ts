import type { Config } from "super-ssg";
import Layout, { filenameInfo } from "./docs/Layout";

export default {
  pages: "docs/**/*.mdx",
  baseurl: process.env.BASE_URL,
  urlForPage(filename: string) {
    const { sectionIndex, pageIndex, pageTitle } = filenameInfo(filename);
    return sectionIndex === 0 && pageIndex === 0
      ? "/"
      : "/" + pageTitle.toLocaleLowerCase().replace(/\s+/, "-");
  },
  Layout,
  cssAnalyzer: true,
} as Config;
