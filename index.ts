import './style.scss';

import {
  exhaustMap,
  fromEvent,
  pairwise,
  first,
  concatMap,
  startWith,
} from 'rxjs';

const body = document.querySelector('body');
const motherbox = document.querySelector('#motherbox');
const counter = document.querySelector('#counter');
const dragStart$ = fromEvent(document, 'dragstart');
const dragEnd$ = fromEvent(document, 'dragend');
const mouseOver$ = fromEvent(document, 'mouseover');
let list: Set<string> = new Set();

dragStart$
  .pipe(
    exhaustMap(() =>
      dragEnd$.pipe(
        concatMap((evt) => mouseOver$.pipe(first(), startWith(evt), pairwise()))
      )
    )
  )
  .subscribe((evts) => {
    const dragTarget = evts[0].target as HTMLDivElement;
    const mouseTarget = evts[1].target as HTMLDivElement;

    const dragTargetID = dragTarget.getAttribute('id');
    const mouseTargetID = mouseTarget.getAttribute('id');

    const element = document.querySelector('#' + dragTargetID);

    mouseTargetID === 'motherbox' ? moveBoxIn(element) : moveBoxOut(element);
  });

function moveBoxIn(element: Element) {
  motherbox.appendChild(element);
  list.add(element.getAttribute('data-value'));
  updateCounter();
}

function moveBoxOut(element: Element) {
  body.appendChild(element);
  list.delete(element.getAttribute('data-value'));
  updateCounter();
}

function updateCounter() {
  counter.setAttribute('value', Array.from(list).toString());
}
