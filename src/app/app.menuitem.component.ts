import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuService } from './service/app.menu.service';
import { AppMainComponent } from './app.main.component';

@Component({
    selector: '[app-menuitem]',
    template: `
        <ng-container>
            <a [attr.href]="item.url" (click)="itemClick($event)" [ngClass]="item.class"
               *ngIf="(!item.routerLink || item.items) && item.visible !== false"
               [attr.target]="item.target" [attr.tabindex]="0" [attr.aria-label]="item.label" role="menuitem" pRipple>
                <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
                <span>{{item.label}}</span>
                <span class="menuitem-badge" *ngIf="item.badge">{{item.badge}}</span>
                <i class="pi pi-fw {{active ? 'pi-angle-up' : 'pi-angle-down'}} ml-auto" *ngIf="item.items"></i>
            </a>
            <a (click)="itemClick($event)" *ngIf="(item.routerLink && !item.items) && item.visible !== false" [ngClass]="item.class"
               [routerLink]="item.routerLink" routerLinkActive="active-menuitem-routerlink router-link-exact-active"
               [routerLinkActiveOptions]="{exact: !item.preventExact}" [attr.target]="item.target" [attr.tabindex]="0" [attr.aria-label]="item.label" role="menuitem" pRipple>
                <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
                <span>{{item.label}}</span>
                <span class="p-tag p-badge ml-auto" *ngIf="item.badge">{{item.badge}}</span>
                <i class="pi pi-fw {{active ? 'pi-angle-up' : 'pi-angle-down'}} ml-auto" *ngIf="item.items"></i>
            </a>
            <ul *ngIf="item.items && item.visible !== false"
                [ngClass]="{ 'menu-visible': active, 'menu-hidden': !active }"
                role="menu">
                <ng-template ngFor let-child let-i="index" [ngForOf]="item.items">
                    <li app-menuitem [item]="child" [index]="i" [parentKey]="key" [class]="child.badgeClass" role="none"></li>
                </ng-template>
            </ul>
        </ng-container>
    `,
    host: {
        '[class.active-menuitem]': 'active',
    }
})
export class AppMenuitemComponent implements OnInit, OnDestroy {
    @Input() item: any;
    @Input() index: number;
    @Input() root: boolean;
    @Input() parentKey: string;

    active = false;
    key: string;
    menuSourceSubscription: Subscription;
    menuResetSubscription: Subscription;

    constructor(
        public app: AppMainComponent,
        public router: Router,
        private cd: ChangeDetectorRef,
        private menuService: MenuService
    ) {
        this.menuSourceSubscription = this.menuService.menuSource$.subscribe(key => {
            if (this.active && this.key !== key && key.indexOf(this.key) !== 0) {
                this.active = false;
            }
        });

        this.menuResetSubscription = this.menuService.resetSource$.subscribe(() => {
            this.active = false;
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                if (this.item.routerLink) {
                    this.updateActiveStateFromRoute();
                } else {
                    this.active = false;
                }
            });
    }

    ngOnInit() {
        if (this.item.routerLink) {
            this.updateActiveStateFromRoute();
        }

        this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);
    }

    updateActiveStateFromRoute() {
        this.active = this.router.isActive(this.item.routerLink[0], !this.item.items);
    }

    itemClick(event: Event) {
        event.stopPropagation();

        if (this.item.disabled) {
            event.preventDefault();
            return;
        }

        this.menuService.onMenuStateChange(this.key);

        if (this.item.command) {
            this.item.command({ originalEvent: event, item: this.item });
        }

        if (this.item.items) {
            this.active = !this.active;
        } else {
            this.active = true;
            this.app.menuActiveMobile = false;

            if (this.app.isDesktop() && this.app.isOverlay()) {
                this.app.menuInactiveDesktop = true;
            }
        }
    }

    ngOnDestroy() {
        this.menuSourceSubscription?.unsubscribe();
        this.menuResetSubscription?.unsubscribe();
    }
}
