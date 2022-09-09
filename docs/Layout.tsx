import { Fragment } from "react";
import {
  classNames,
  A,
  InlineCss,
  ExternalCss,
  useTableOfContents,
} from "super-ssg";

export const filenameInfo = (filename: string) => {
  const {
    1: sectionIndex,
    2: sectionTitle,
    3: pageIndex,
    4: pageTitle,
  } = filename.match(/(\d+) - ([^/.]+)\/(\d+) - ([^/.]+)/)!;

  return {
    sectionIndex: Number(sectionIndex),
    sectionTitle: sectionTitle.replace(/\s+/g, "-"),
    pageIndex: Number(pageIndex),
    pageTitle: pageTitle.replace(/\s+/g, "-"),
  };
};

const useSections = () => {
  const sections: Array<{
    title: string;
    index: number;
    pages: Array<{ filename: string; title: any; index: number }>;
  }> = [];

  useTableOfContents().forEach(({ filename }) => {
    const { sectionIndex, sectionTitle, pageIndex, pageTitle } =
      filenameInfo(filename);

    const page = { filename, title: pageTitle, index: pageIndex };

    if (sections[sectionIndex] == null) {
      sections[sectionIndex] = {
        title: sectionTitle,
        index: sectionIndex,
        pages: [page],
      };
    } else {
      sections[sectionIndex].pages.push(page);
    }
  });

  const byIndex = (a: { index: number }, b: { index: number }) =>
    a.index - b.index;
  sections.sort(byIndex);
  sections.forEach(({ pages }) => pages.sort(byIndex));

  return sections;
};

export default ({ filename, children }) => {
  const sections = useSections();
  const { pageTitle } = filenameInfo(filename);

  return (
    <html>
      <head>
        <title>{pageTitle}</title>
        <meta charSet="utf-8" />
        <InlineCss src={"/docs/index.css"} />
        <ExternalCss src={["/docs/Nav.css", "/docs/code.css"]} />
      </head>
      <body>
        <nav className={classNames("Nav")}>
          <div className={classNames("Nav__Menu")}>
            <a href="/" className={classNames("Nav__Logo")}>
              Super SSG
            </a>
            <a className={classNames("Nav__MenuButton")} href="#menu">
              Menu
            </a>
          </div>
          <div id="menu" className={classNames("Nav__MobileOverlay")}>
            <a
              className={classNames("Nav__MenuButton Nav__MenuButton--close")}
              href="#"
            >
              Close
            </a>
            {sections.map((section) => (
              <Fragment key={section.index}>
                <h6 className={classNames("Nav__Title")}>{section.title}</h6>
                <ul className={classNames("Nav__PageList")}>
                  {section.pages.map((page) => (
                    <li key={section.index}>
                      <A
                        href={page.filename}
                        className={[
                          "Nav__PageLink",
                          filename === page.filename && "Nav__PageLink--active",
                        ]}
                      >
                        {page.title}
                      </A>
                    </li>
                  ))}
                </ul>
              </Fragment>
            ))}
          </div>
        </nav>
        <main>
          <h1>{pageTitle}</h1>
          {children}
        </main>
      </body>
    </html>
  );
};
