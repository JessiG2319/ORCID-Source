import * as angular 
    from 'angular';

import { CommonModule } 
    from '@angular/common'; 

import { Directive, NgModule } 
    from '@angular/core';

import { FormsModule }
    from '@angular/forms'; // <-- NgModel lives here

import { downgradeComponent, UpgradeModule } 
    from '@angular/upgrade/static';

//User generated components
import { FundingComponent } 
    from './funding.component.ts';

import { PrivacytoggleNg2Module }
    from './../privacytoggle/privacyToggle.ts';

//User generated filters
import { OrderByPipe }
    from '../../pipes/orderByNg2.ts'; 

import { AjaxFormDateToISO8601Pipe }
    from '../../pipes/ajaxFormDateToISO8601Ng2.ts'; 

// This is the Angular 1 part of the module
export const FundingModule = angular.module(
    'FundingModule', 
    []
);

// This is the Angular 2 part of the module
@NgModule(
    {
        imports: [
            CommonModule,
            FormsModule,
            PrivacytoggleNg2Module
        ],
        declarations: [ 
            FundingComponent,
            OrderByPipe
        ],
        entryComponents: [ 
            FundingComponent 
        ],
        providers: [
            
        ]
    }
)
export class FundingNg2Module {}

// components migrated to angular 2 should be downgraded here
//Must convert as much as possible of our code to directives
FundingModule.directive(
    'fundingNg2', 
    <any>downgradeComponent(
        {
            component: FundingComponent,
        }
    )
);
