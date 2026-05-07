import { Component, Input } from '@angular/core';

export interface StepperStep {
  label: string;
}

@Component({
  selector: 'app-stepper',
  standalone: true,
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
})
export class StepperComponent {
  @Input() steps: StepperStep[] = [];
  @Input() currentStep = 1; // 1-indexed

  state(i: number): 'done' | 'on' | 'pending' {
    const oneIndexed = i + 1;
    if (oneIndexed < this.currentStep) return 'done';
    if (oneIndexed === this.currentStep) return 'on';
    return 'pending';
  }
}
