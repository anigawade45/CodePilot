import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// 🧪 MOCKING BROWSER APIs NOT IMPLEMENTED BY JSDOM
// CodeMirror and other components rely on layout measurements
if (typeof window !== 'undefined') {
  Range.prototype.getClientRects = vi.fn(() => ({
    item: () => null,
    length: 0,
    [Symbol.iterator]: function* () { },
  }));

  Range.prototype.getBoundingClientRect = vi.fn(() => ({
    display: 'none',
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }));
}

// 🎬 GLOBAL FRAMER MOTION MOCK
// Prevents "prop not recognized" warnings by filtering out animation props
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal();
  const mockComponent = (tag) => {
    // eslint-disable-next-line react/display-name
    return (allProps) => {
      // List of framer-motion props to OMIT from the final DOM element
      const {
        children,
        whileHover,
        whileTap,
        whileInView,
        whileFocus,
        whileDrag,
        initial,
        animate,
        exit,
        variants,
        transition,
        viewport,
        layout,
        layoutId,
        layoutDependency,
        onAnimationStart,
        onAnimationComplete,
        onUpdate,
        onPan,
        onPanStart,
        onPanEnd,
        onTap,
        onTapStart,
        onTapCancel,
        onHoverStart,
        onHoverEnd,
        drag,
        dragControls,
        dragListener,
        dragMomentum,
        dragElastic,
        dragConstraints,
        dragDirectionLock,
        dragPropagation,
        dragTransition,
        ...rest
      } = allProps;

      return React.createElement(tag, rest, children);
    };
  };

  return {
    ...actual,
    motion: {
      div: mockComponent('div'),
      h1: mockComponent('h1'),
      h2: mockComponent('h2'),
      h3: mockComponent('h3'),
      h4: mockComponent('h4'),
      p: mockComponent('p'),
      span: mockComponent('span'),
      button: mockComponent('button'),
      section: mockComponent('section'),
      article: mockComponent('article'),
      aside: mockComponent('aside'),
      nav: mockComponent('nav'),
      footer: mockComponent('footer'),
      header: mockComponent('header'),
      main: mockComponent('main'),
      circle: mockComponent('circle'),
      svg: mockComponent('svg'),
      path: mockComponent('path'),
    },
    AnimatePresence: ({ children }) => children,
    useReducedMotion: () => false,
    useAnimation: () => ({
      start: vi.fn(),
      stop: vi.fn(),
      set: vi.fn(),
    }),
  };
});
