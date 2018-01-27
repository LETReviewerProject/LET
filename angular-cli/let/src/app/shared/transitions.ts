import { trigger, state, animate, style, transition, keyframes } from '@angular/core';

export const slideFromRightAnimation =
  trigger('slideFromRight', [
    transition(':enter', [
      style({ transform: 'translateX(100%)' }),
      animate('0.2s ease-in-out', style({ transform: 'translateX(0%)' }))
    ]),
    transition(':leave', [
      style({ transform: 'translateX(100%)' }),
      animate('0.1s ease-in-out', style({ transform: 'translateX(-100%)' }))
    ])
  ]);

//slide from the right animation
export const growSlowlyAnimation =
  trigger('growSlowly', [
    transition('* => *', animate(300, keyframes([
      style({ 'opacity': '.1', 'transform': 'scale(.98)' }),
      style({ 'opacity': '1', 'transform': 'scale(1)' })
    ])))
  ]);

//grow animate container
export const growAnimateContainer =
  trigger('growAnimate', [
    transition('* => *', animate(300, keyframes([
      style({ 'opacity': '0', 'transform': 'scale(0)' }),
      style({ 'opacity': '0', 'transform': 'scale(.1)' }),
      style({ 'opacity': '0.2', 'transform': 'scale(.2)' }),
      style({ 'opacity': '0.3', 'transform': 'scale(.3)' }),
      style({ 'opacity': '0.5', 'transform': 'scale(.4)' }),
      style({ 'opacity': '1', 'transform': 'scale(.8)' }),
      style({ 'opacity': '1', 'transform': 'scale(.9)' }),
      style({ 'opacity': '1', 'transform': 'scale(1)' })
    ])))
  ])
