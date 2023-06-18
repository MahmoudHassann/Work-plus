import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'freelance',
    templateUrl    : './freelance.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class freelanceComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
