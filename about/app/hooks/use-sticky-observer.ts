import { useEffect, useState } from "react";

export const useStickyObserver = ({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
}) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([e]) => {
        const scrollableContainer = ref.current
          ? ref.current.closest(".sticky-scrollable-container")
          : null;

        setIsSticky(
          !!scrollableContainer &&
            scrollableContainer.scrollTop > 0 &&
            e.intersectionRatio < 1 &&
            !e.isIntersecting,
        );
      },
      { threshold: [1] },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [ref]);

  return isSticky;
};
