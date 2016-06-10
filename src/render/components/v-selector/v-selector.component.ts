import {Component, HostListener, Input, EventEmitter, Output} from '@angular/core';
import {DomSanitizationService} from '@angular/platform-browser';
import {IVisualization, IParamUpdate} from '../../../common/models';
import {ParameterControls} from '../parameter-controls/parameter-controls.component';
import {KEYCODE_RIGHT_ARROW, KEYCODE_LEFT_ARROW} from '../../../common/constants';
import {IState} from '../../providers/state.service.';
import {GainSelector} from '../gain-selector/gain-selector.component';

@Component({
    selector: 'v-selector',
    template: require('./v-selector.component.html'),
    styles: [require('./v-selector.scss').toString()],
    directives: [ParameterControls, GainSelector]
})
export class VSelector {
    @Input() state: IState;
    @Input() current: IVisualization;
    @Output() select = new EventEmitter<number>();
    @Output() setGain = new EventEmitter<number>();
    @Output() toggleExpandClick = new EventEmitter<boolean>();
    @Output() toggleNormalization = new EventEmitter<boolean>();    
    @Output() updateParam = new EventEmitter<IParamUpdate>();
    private icon_arrow = require('../../../assets/icons/play_arrow.svg');
    private icon_caret = require('../../../assets/icons/keyboard_arrow_down.svg');
    private offsetTop: any;

    constructor(private sanitizer: DomSanitizationService) {}

    ngOnInit(): void {
        this.reposition();
    }

    @HostListener('document:keydown', ['$event'])
    reloadVis(e: KeyboardEvent): void {
        switch (e.which) {
            case KEYCODE_RIGHT_ARROW:
                this.selectNext();
                break; 
            case KEYCODE_LEFT_ARROW:
                this.selectPrev();
                break;
        }
    } 

    @HostListener('window:resize')
    reposition(): void {
        let height = window.innerHeight;
        this.offsetTop = this.sanitizer.bypassSecurityTrustStyle(`transform: translateY(${height - 150}px);`);
    }

    /**
     * Select the next visualization in the library
     */
    selectNext(): void {
        let currentIndex = this.getCurrentIndex();
        if (currentIndex === -1) {
            return;
        }
        let nextIndex;
        if (currentIndex < this.state.library.length - 1) {
            nextIndex = currentIndex + 1;
        } else {
            nextIndex = 0;
        }
        this.select.emit(nextIndex);
    }

    /**
     * Select the previous visualization in the library
     */
    selectPrev(): void {
        let currentIndex = this.getCurrentIndex();
        if (currentIndex === -1) {
            return;
        }
        let nextIndex;
        if (currentIndex === 0) {
            nextIndex = this.state.library.length - 1;
        } else {
            nextIndex = currentIndex - 1;
        }
        this.select.emit(nextIndex);
    }

    private getCurrentIndex(): number {
        let library = this.state.library;
        if (library && library instanceof Array && this.current) {
            return library.map(v => v.name).indexOf(this.current.name);
        }
        return -1;
    }
}
