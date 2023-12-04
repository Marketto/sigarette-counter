import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  Subscription,
  debounceTime,
  filter,
  fromEvent,
  map,
  merge,
  of,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';

export type HoldEvent = TouchEvent | MouseEvent | KeyboardEvent | undefined;

@Directive({
  selector: '[hold]',
})
export class HoldDirective implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  @Input()
  public threshold: number = 500;

  @Output()
  public readonly hold: EventEmitter<HoldEvent> = new EventEmitter<HoldEvent>();

  @Output()
  public readonly release: EventEmitter<HoldEvent> =
    new EventEmitter<HoldEvent>();

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const EVENT_END_MAP: { [key: string]: string } = {
      touchstart: 'touchend',
      mousedown: 'mouseup',
      keydown: 'keyup',
    };
    this.subscriptions.push(
      merge(
        fromEvent<TouchEvent>(this.elementRef.nativeElement, 'touchstart').pipe(
          map((event) => ({ event, helding: event.touches?.length === 1 }))
        ),
        fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mousedown').pipe(
          map((event) => ({ event, helding: event.buttons === 1 }))
        ),
        fromEvent<KeyboardEvent>(this.elementRef.nativeElement, 'keydown').pipe(
          map((event) => ({ event, helding: event.key === 'Enter' }))
        )
      )
        .pipe(
          map(({ event, helding }) => ({
            event,
            helding:
              helding &&
              ![
                event.altKey,
                event.ctrlKey,
                event.metaKey,
                event.shiftKey,
              ].includes(true),
          })),
          switchMap((heldEvent) =>
            heldEvent.helding
              ? fromEvent<TouchEvent>(
                  this.elementRef.nativeElement,
                  EVENT_END_MAP[heldEvent.event.type]
                ).pipe(
                  take(1),
                  map((event) => ({ event, helding: false })),
                  startWith(heldEvent)
                )
              : of(heldEvent)
          ),
          tap(({ event, helding }) => {
            if (!helding) {
              event.stopImmediatePropagation();
              this.release.emit(event);
            }
          }),
          debounceTime(this.threshold),
          filter(({ helding }) => helding),
          tap(({ event }) => {
            event.stopImmediatePropagation();
            this.hold.emit(event);
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.length = 0;
  }
}
