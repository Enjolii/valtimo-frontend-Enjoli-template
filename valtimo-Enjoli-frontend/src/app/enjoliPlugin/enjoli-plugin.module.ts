import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PluginTranslatePipeModule} from '@valtimo/plugin';
import {FormModule, InputModule} from '@valtimo/components';
import {EnjoliPluginConfigurationComponent} from './models/enjoli-plugin-configuration.component';
import {EnjoliActionConfigurationComponent} from './components/create-object/enjoli-action-configuration.component';
import {PrintActionConfigurationComponent} from './components/print-action/print-action-configuration.component';

@NgModule({
  declarations: [EnjoliPluginConfigurationComponent, EnjoliActionConfigurationComponent, PrintActionConfigurationComponent],
  imports: [CommonModule, PluginTranslatePipeModule, FormModule, InputModule],
  exports: [EnjoliPluginConfigurationComponent, EnjoliActionConfigurationComponent, PrintActionConfigurationComponent],
})
export class EnjoliPluginModule {
}
