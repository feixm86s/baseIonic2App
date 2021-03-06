import {Component, ViewChild} from '@angular/core';
import {Nav, Platform, ToastController,MenuController,Events} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {Page1Page} from '../pages/home/page1/page1';
import {TabsPage} from '../pages/tabs/tabs';

import {ZhiHuAPI} from '../providers/zhihuAPI'


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = TabsPage;

    list: any;
    backButtonPressed: boolean = false;

    constructor(public platform: Platform,
                public statusBar: StatusBar,
                public zhiHuAPI:ZhiHuAPI,
                public menuCtrl: MenuController,
                public events: Events,
                public splashScreen: SplashScreen,
                public toastCtrl: ToastController) {
        this.initializeApp();

        this.zhiHuAPI.getTopics().then(data=>{
            console.log("**********************"+JSON.stringify(data));
            this.list=data['others'];

        },err=>{

        });



    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.

            this.splashScreen.hide();
            this.statusBar.styleLightContent();
        });
        this.platform.registerBackButtonAction((): any => {
            let activeVC = this.nav.getActive();
            let page = activeVC.instance;
            if (!(page instanceof TabsPage)) {
                if (!this.nav.canGoBack()) {
                    return this.showExit();
                }
                //当前页面为tabs的子页面，正常返回
                return this.nav.pop();
            }
            let tabs = page.tabs;
            let activeNav = tabs.getSelected();
            if (!activeNav.canGoBack()) {
                //当前页面为tab栏，退出APP
                return this.showExit();
            }
            //当前页面为tab栏的子页面，正常返回
            return activeNav.pop();
        }, 101);
    }

    showExit() {
        if (this.backButtonPressed) this.platform.exitApp();
        else {
            let toast = this.toastCtrl.create({
                message: '再按一次退出应用',
                duration: 2000,
                position: 'bottom'
            });
            toast.present();
            this.backButtonPressed = true;
            setTimeout(() => {
                this.backButtonPressed = false;
            }, 2000)
        }
    }

    openPage(id?) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        // this.nav.setRoot(page.component);

        if(!!id){
            this.events.publish('changeType', id);
        }else{
            this.events.publish('home');
        }

        this.menuCtrl.close();

    }
}
