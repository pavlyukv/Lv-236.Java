import {Component, OnInit} from '@angular/core';
import {Response} from '@angular/http';
import {Principal} from '../shared/auth/principal.service';
import {JhiLanguageService, AlertService, EventManager} from 'ng-jhipster';

import {TeacherMySuffix} from './../entities/teacher/teacher-my-suffix.model';

import {TeacherClassService} from './teacher-class.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'teacher-class',
    templateUrl: './teacher-class.component.html',
    styles: []
})
export class TeacherClassComponent implements OnInit {
    currentAccount: any;
    currentTeacher: TeacherMySuffix;
    eventSubscriber: Subscription;
    name: string;

    constructor(
                private jhiLanguageService: JhiLanguageService,
                private principal: Principal,
                private teacherClassService: TeacherClassService,
                private alertService: AlertService) {
        this.jhiLanguageService.setLocations(['teacher-class']);
    }

    ngOnInit() {
        this.loadCurrentTeacher();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
    }

    loadCurrentTeacher() {
        this.teacherClassService.getCurrentTeacher().subscribe(
            (res: Response) => {
                this.currentTeacher = res.json();
            },
            (res: Response) => this.onError(res.json())
        );
    }
    previousState() {
        window.history.back();
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}

