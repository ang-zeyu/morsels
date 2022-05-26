import { computePosition, size, flip, arrow, Placement } from '@floating-ui/dom';

import { SearchUiOptions } from '../SearchUiOptions';
import { setCombobox, setInputAria } from '../utils/aria';
import h from '../utils/dom';


export function openDropdown(root: HTMLElement, listContainer: HTMLElement, placement: Placement) {
  if (listContainer.childElementCount) {
    const innerRoot = root.lastElementChild as HTMLElement;
    const caret = innerRoot.firstElementChild as HTMLElement;
    innerRoot.style.display = 'block';
    computePosition(root, innerRoot, {
      placement,
      middleware: [
        flip({
          padding: 10,
          mainAxis: false,
        }),
        size({
          apply({ availableWidth, availableHeight }) {
            Object.assign(listContainer.style, {
              maxWidth: `min(${availableWidth}px, var(--morsels-dropdown-max-width))`,
              maxHeight: `min(${availableHeight}px, var(--morsels-dropdown-max-height))`,
            });
          },
          padding: 10,
        }),
        arrow({
          element: caret,
        }),
      ],
    }).then(({ x, y, middlewareData }) => {
      Object.assign(innerRoot.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
  
      const { x: arrowX } = middlewareData.arrow;
      Object.assign(caret.style, {
        left: arrowX != null ? `${arrowX}px` : '',
      });
    });
  }
}

export function closeDropdown(root: HTMLElement) {
  (root.lastElementChild as HTMLElement).style.display = 'none';
}

export function dropdownRootRender(opts: SearchUiOptions, inputEl: HTMLInputElement) {
  const listContainer = h('ul', {
    id: 'morsels-dropdown-list',
    class: 'morsels-list',
  });
  const root = h('div', { class: 'morsels-root' },
    inputEl,
    h('div',
      { class: 'morsels-inner-root', style: 'display: none;' },
      h('div', { class: 'morsels-input-dropdown-separator' }),
      listContainer,
    ),
  );
  
  setInputAria(inputEl, 'morsels-dropdown-list');
  setCombobox(root, listContainer, opts.uiOptions.label);
  
  return {
    dropdownRoot: root,
    dropdownListContainer: listContainer,
  };
}

export function openFullscreen(root: HTMLElement, listContainer: HTMLElement, fsContainer: HTMLElement) {
  fsContainer.appendChild(root);
  const input: HTMLInputElement = root.querySelector('input.morsels-fs-input');
  if (input) {
    input.focus();
  }

  const currentFocusedResult = listContainer.querySelector('.focus') as HTMLElement;
  if (currentFocusedResult) {
    listContainer.scrollTo({ top: currentFocusedResult.offsetTop - listContainer.offsetTop - 30 });
  }
}

export function closeFullscreen(root: HTMLElement) {
  root.remove();
}

export function fsRootRender(
  opts: SearchUiOptions,
  fsCloseHandler: () => void,
) {
  const inputEl = h(
    'input', {
      class: 'morsels-fs-input',
      type: 'search',
      placeholder: opts.uiOptions.fsPlaceholder,
      autocomplete: 'false',
      'aria-labelledby': 'morsels-fs-label',
    },
  ) as HTMLInputElement;
  setInputAria(inputEl, 'morsels-fs-list');
  
  const buttonEl = h('button', { class: 'morsels-input-close-fs' }, opts.uiOptions.fsCloseText);
  buttonEl.onclick = (ev) => {
    ev.preventDefault();
    fsCloseHandler();
  };
  
  const listContainer = h('ul', {
    id: 'morsels-fs-list',
    class: 'morsels-list',
    'aria-labelledby': 'morsels-fs-label',
  });
    
  const innerRoot = h('div',
    { class: 'morsels-root morsels-fs-root' },
    h('form',
      { class: 'morsels-fs-input-button-wrapper' },
      h('label',
        { id: 'morsels-fs-label', for: 'morsels-fs-input', style: 'display: none' },
        opts.uiOptions.label,
      ),
      inputEl,
      buttonEl,
    ),
    listContainer,
  );
  innerRoot.onclick = (ev) => ev.stopPropagation();
  innerRoot.onmousedown = (ev) => ev.stopPropagation();
  
  setCombobox(innerRoot, listContainer, opts.uiOptions.label);
  
  const rootBackdropEl = h('div', { class: 'morsels-fs-backdrop' }, innerRoot);
  rootBackdropEl.onmousedown = fsCloseHandler;
  rootBackdropEl.onkeyup = (ev) => {
    if (ev.code === 'Escape') {
      ev.stopPropagation();
      fsCloseHandler();
    }
  };
  
  return {
    root: rootBackdropEl,
    listContainer,
    input: inputEl,
  };
}