/**
 * Contains spatial (DOM) helper functions.
 *
 * @since 29/12/2022
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */


/**
 * Gets the absolute offset of an element from the top of the page.
 *
 * @param el the element
 * @returns the absolute offset of the element from the top of the page
 */
export function getAbsoluteTop(el: Element | null): number {
    let totalOffsetTop = 0;
    let currentElement = el as HTMLElement;
    while (currentElement) {
        totalOffsetTop += currentElement.offsetTop;
        currentElement = currentElement.offsetParent as HTMLElement;
    }
    return totalOffsetTop;
}
