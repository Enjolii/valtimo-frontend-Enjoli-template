import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PluginConfigurationComponent} from '@valtimo/plugin';
import {BehaviorSubject, combineLatest, Observable, Subscription, take} from 'rxjs';
import {EnjoliPluginConfig} from '../components/api-configuration/enjoli-plugin-config';

@Component({
  selector: 'enjoli-plugin-configuration',
  templateUrl: '../components/api-configuration/enjoli-plugin-configuration.component.html',
})
export class EnjoliPluginConfigurationComponent
  // The component explicitly implements the PluginConfigurationComponent interface
  implements PluginConfigurationComponent, OnInit, OnDestroy {
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  // If the plugin had already been saved, a prefill configuration of the type EnjoliPluginConfig is expected
  @Input() prefillConfiguration$: Observable<EnjoliPluginConfig>;

  // If the configuration data changes, output whether the data is valid or not
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  // If the configuration is valid, output a configuration of the type EnjoliPluginConfig
  @Output() configuration: EventEmitter<EnjoliPluginConfig> =
    new EventEmitter<EnjoliPluginConfig>();

  private saveSubscription!: Subscription;

  private readonly formValue$ = new BehaviorSubject<EnjoliPluginConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.openSaveSubscription();
  }

  ngOnDestroy() {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formValue: EnjoliPluginConfig): void {
    this.formValue$.next(formValue);
    this.handleValid(formValue);
  }

  private handleValid(formValue: EnjoliPluginConfig): void {
    // The configuration is valid when a configuration title and url are defined
    const valid = !!(formValue.configurationTitle);

    this.valid$.next(valid);
    this.valid.emit(valid);
  }

  private openSaveSubscription(): void {
    /*
    If the save observable is triggered, check if the configuration is valid, and if so,
    output the configuration using the configuration EventEmitter.
     */
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
