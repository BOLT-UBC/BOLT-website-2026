/**
 * Utility functions for DOM manipulation
 */

/**
 * Scrolls to a specific element with smooth behavior
 * If the section is smaller than viewport, centers it
 * If larger, positions the header just below the navbar
 * @param elementId - ID of the target element
 * @returns True if successful, false if element not found
 */
export const scrollToElement = (
  elementId: string
): boolean => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementRect = element.getBoundingClientRect();
    const elementHeight = element.offsetHeight;
    const viewportHeight = window.innerHeight;
    const elementPosition = elementRect.top + window.scrollY;

    let scrollPosition;

    // If section is smaller than viewport, center it
    if (elementHeight < viewportHeight) {
      scrollPosition = elementPosition - (viewportHeight - elementHeight) / 2;
    } else {
      // If section is larger, position header just below navbar
      scrollPosition = elementPosition;
    }

    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
    return true;
  }
  return false;
};

