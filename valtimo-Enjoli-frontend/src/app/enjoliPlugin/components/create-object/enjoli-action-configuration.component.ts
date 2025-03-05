import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, Observable, Subscription, take} from 'rxjs';
import {EnjoliActionsConfig} from '../../models';

@Component({
  selector: 'enjoli-action-configuration',
  templateUrl: './enjoli-action-configuration.component.html',
})
export class EnjoliActionConfigurationComponent
  // The component explicitly implements the FunctionConfigurationComponent interface
  implements FunctionConfigurationComponent, OnInit, OnDestroy {
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input() prefillConfiguration$: Observable<EnjoliActionsConfig>;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<EnjoliActionsConfig> =
    new EventEmitter<EnjoliActionsConfig>();

  private saveSubscription!: Subscription;

  private readonly formValue$ = new BehaviorSubject<EnjoliActionsConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.openSaveSubscription();
  }

  ngOnDestroy() {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formValue: EnjoliActionsConfig): void {
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  private handleValid(formValue: EnjoliActionsConfig): void {
    const valid = !!(formValue.type && formValue.filmdata && formValue.gamedata && formValue.apiUrl);

    this.valid$.next(valid);
    this.valid.emit(valid);
  }

  private openSaveSubscription(): void {
    this.saveSubscription = this.save$?.subscribe(save => {
      combineLatest([this.formValue$, this.valid$])
        .pipe(take(1))
        .subscribe(([formValue, valid]) => {
          if (valid) {
            this.configuration.emit(formValue);
          }
        });
    });
  }
}
