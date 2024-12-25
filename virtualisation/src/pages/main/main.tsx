import { useEffect, useMemo, useRef, useState } from "react";
import reactLogo from "../../assets/react.svg";
import styles from "./main.module.css";
import viteLogo from "/vite.svg";

const ITEM_HEIGHT = 50;
const OVERSCAN = 10; // default 10
const NUMBER_OF_ITEMS = 10000;

export const Main = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  
  // Recalculate start and end indices based on the scroll position and window height
  const startIndex = Math.max(Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN, 0);
  const renderedItemsCount = Math.min(Math.floor(windowHeight / ITEM_HEIGHT) + 2 * OVERSCAN, NUMBER_OF_ITEMS - startIndex);

  // Update scrollTop on scroll event
  useEffect(() => {
    const handleScroll = (event: Event) => {
      setScrollTop((event.currentTarget as HTMLDivElement).scrollTop);
    };

    const currentRef = contentRef.current;
    currentRef?.addEventListener("scroll", handleScroll);

    setWindowHeight(currentRef?.clientHeight || 0);

    return () => {
      currentRef?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(contentRef.current?.clientHeight || 0);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Memoize the items to render based on current indices
  const items = useMemo(() => {
    const items: JSX.Element[] = [];
    for (let i = 0; i < renderedItemsCount; i++) {
      const index = i + startIndex;
      items.push(
        <div
          key={index}
          style={{
            width: "100%",
            height: ITEM_HEIGHT,
            top: `${ITEM_HEIGHT * index}px`,
            backgroundColor: index % 2 === 0 ? "lightgrey" : "white",
          }}
        >
          Item {index}
        </div>
      );
    }
    return items;
  }, [renderedItemsCount, startIndex]);

  console.log("startIndex", startIndex);
  console.log("items", items);

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <img src={reactLogo} className="logo" alt="React logo" />
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </nav>
      <div ref={contentRef} className={styles.content}>
        <div style={{ height: `${NUMBER_OF_ITEMS * ITEM_HEIGHT}px` }}>
          <div style={{transform: `translateY(${startIndex * ITEM_HEIGHT}px)`}}>
            {items}
          </div>
        </div>
      </div>
    </div>
  );
};
