import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboards/project'
    {path: '', pathMatch : 'full', redirectTo: 'dashboards/project'},

    // Redirect signed in user to the '/dashboards/project'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboards/project'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
        ]
    },

    // Landing routes
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },

    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [

            // Dashboards
            {path: 'dashboards', children: [
                {path: 'project', loadChildren: () => import('app/modules/admin/dashboards/project/project.module').then(m => m.ProjectModule)},
                {path: 'analytics', loadChildren: () => import('app/modules/admin/dashboards/analytics/analytics.module').then(m => m.AnalyticsModule)},
                {path: 'finance', loadChildren: () => import('app/modules/admin/dashboards/finance/finance.module').then(m => m.FinanceModule)},
                {path: 'crypto', loadChildren: () => import('app/modules/admin/dashboards/crypto/crypto.module').then(m => m.CryptoModule)},
            ]},

            // Apps
            {path: 'apps', children: [
                {path: 'user', loadChildren: () => import('app/modules/admin/apps/user/user.module').then(m => m.UserModule)},
                {path: 'college', loadChildren: () => import('app/modules/admin/apps/college/college.module').then(m => m.CollegeModule)},
                {path: 'location', loadChildren: () => import('app/modules/admin/apps/location/location.module').then(m => m.LocationModule)},
                {path: 'event', loadChildren: () => import('app/modules/admin/apps/event/event.module').then(m => m.EventModule)},
                {path: 'blog', loadChildren: () => import('app/modules/admin/apps/blog/blog.module').then(m => m.BlogModule)},
                {path: 'package', loadChildren: () => import('app/modules/admin/apps/package/package.module').then(m => m.PackageModule)},
                {path: 'scholerships', loadChildren: () => import('app/modules/admin/apps/scholerships/scholerships.module').then(m => m.ScholershipsModule)},
                {path: 'loans', loadChildren: () => import('app/modules/admin/apps/loans/loans.module').then(m => m.LoansModule)},
                {path: 'careers', loadChildren: () => import('app/modules/admin/apps/careers/careers.module').then(m => m.CareersModule)},
                {path: 'exams', loadChildren: () => import('app/modules/admin/apps/exams/exams.module').then(m => m.ExamsModule)},
                {path: 'faqs', loadChildren: () => import('app/modules/admin/apps/faqs/faqs.module').then(m => m.FaqsModule)},
                {path: 'course', loadChildren: () => import('app/modules/admin/apps/course/course.module').then(m => m.CourseModule)},
                {path: 'enquiry', loadChildren: () => import('app/modules/admin/apps/enquiry/enquiry.module').then(m => m.EnquiryModule)},
                {path: 'application', loadChildren: () => import('app/modules/admin/apps/application/application.module').then(m => m.ApplicationModule)},
                {path: 'courseenquiry', loadChildren: () => import('app/modules/admin/apps/courseenquiry/courseenquiry.module').then(m => m.CourseenquiryModule)},
                {path: 'predict', loadChildren: () => import('app/modules/admin/apps/predict/predict.module').then(m => m.PredictModule)},
                {path: 'notification', loadChildren:()=>import('app/modules/admin/apps/notification/notification.module').then(m=>m.NotificationModule)},
                {path: 'courseDetails', loadChildren: () => import('app/modules/admin/apps/editcourse/editcourse.module').then(m => m.EditcourseModule)},
                {path: 'counsellingfee', loadChildren: () => import('app/modules/admin/apps/counsellingfee/counsellingfee.module').then(m => m.CounsellingfeeModule)},
                {path: 'reports', loadChildren: () => import('app/modules/admin/apps/reports/reports.module').then(m => m.ReportsModule)},
                {path: 'certification', loadChildren: () => import('app/modules/admin/apps/certification/certification.module').then(m =>m.CertificationModule)},
                {path: 'specilisation', loadChildren: () => import('app/modules/admin/apps/specilisation/specilisation.module').then(m =>m.SpecilisationModule)},
                // {path: 'kcetcutoff', loadChildren: () => import('app/modules/admin/apps/kcetcutoff/kcetcutoff.module').then(m =>m.KcetcutoffModule)}
             {path: 'cutoffkcet', loadChildren: () => import('app/modules/admin/apps/cutoffkcet/cutoffkcet.module').then(m =>m.CutoffkcetModule)},
             {path:'comedk', loadChildren: ()=> import('app/modules/admin/apps/comedk/comedk.module').then(m =>m.ComedkModule)},
             {path: 'neetpredictor', loadChildren: () => import('app/modules/admin/apps/neetpredictor/neetpredictor.module').then(m => m.NeetpredictorModule)},
             {path: 'seatavailability', loadChildren: () => import('app/modules/admin/apps/seatavailability/seatavailability.module').then(m => m.SeatavailabilityModule)},
             {path: 'managementseat', loadChildren: () => import('app/modules/admin/apps/managementseat/managementseat.module').then(m => m.ManagementSeatModule)},
             {path: 'genericpredictor', loadChildren: () => import('app/modules/admin/apps/genericpredictor/genericpredictor.module').then(m => m.GenericpredictorModule)},
             {path: "studyabroad", loadChildren: () => import("app/modules/admin/apps/studyabroad/studyabroad.module").then(m => m.StudyAbroadModule)},
             {path: "mocktests", loadChildren: () => import("app/modules/admin/apps/mocktests/mocktests.module").then(m => m.MockTestsModule)},
             {path: "alerts", loadChildren: () => import("app/modules/admin/apps/alerts/alerts.module").then(m => m.AlertsModule)},
             {path: "rankpredictor", loadChildren: () => import("app/modules/admin/apps/rankpredictor/rankpredictor.module").then(m => m.RankPredictorModule)},
             {path: 'questionsandans', loadChildren: () => import('app/modules/admin/apps/questionsandans/questionsandans.module').then(m =>m.QuestionsandansModule)},
             {path: 'leadcapture', loadChildren: () => import('app/modules/admin/apps/leadcapture/leadcapture.module').then(m => m.LeadcaptureModule)},
             {path: "seotools", loadChildren: () => import("app/modules/admin/apps/seotools/seotools.module").then(m => m.SeotoolsModule)},

               // {path: 'kcetcutoff', loadChildren: () => import('app/modules/admin/apps/cutoff/kcetcutoff/kcetcutoff.component').then(m =>m.KcetcutoffComponent)}




            ]},

            // Pages
            {path: 'pages', children: [

                // Activities
                {path: 'activities', loadChildren: () => import('app/modules/admin/pages/activities/activities.module').then(m => m.ActivitiesModule)},

                // Authentication
                {path: 'authentication', loadChildren: () => import('app/modules/admin/pages/authentication/authentication.module').then(m => m.AuthenticationModule)},

                // Coming Soon
                {path: 'coming-soon', loadChildren: () => import('app/modules/admin/pages/coming-soon/coming-soon.module').then(m => m.ComingSoonModule)},

                // Error
                {path: 'error', children: [
                    {path: '404', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module)},
                    {path: '500', loadChildren: () => import('app/modules/admin/pages/error/error-500/error-500.module').then(m => m.Error500Module)}
                ]},

                // Invoice
                {path: 'invoice', children: [
                    {path: 'printable', children: [
                        {path: 'compact', loadChildren: () => import('app/modules/admin/pages/invoice/printable/compact/compact.module').then(m => m.CompactModule)},
                        {path: 'modern', loadChildren: () => import('app/modules/admin/pages/invoice/printable/modern/modern.module').then(m => m.ModernModule)}
                    ]}
                ]},

                // Maintenance
                {path: 'maintenance', loadChildren: () => import('app/modules/admin/pages/maintenance/maintenance.module').then(m => m.MaintenanceModule)},

                // Pricing
                {path: 'pricing', children: [
                    {path: 'modern', loadChildren: () => import('app/modules/admin/pages/pricing/modern/modern.module').then(m => m.PricingModernModule)},
                    {path: 'simple', loadChildren: () => import('app/modules/admin/pages/pricing/simple/simple.module').then(m => m.PricingSimpleModule)},
                    {path: 'single', loadChildren: () => import('app/modules/admin/pages/pricing/single/single.module').then(m => m.PricingSingleModule)},
                    {path: 'table', loadChildren: () => import('app/modules/admin/pages/pricing/table/table.module').then(m => m.PricingTableModule)}
                ]},

                // Profile
                {path: 'profile', loadChildren: () => import('app/modules/admin/pages/profile/profile.module').then(m => m.ProfileModule)},

                // Settings
                {path: 'settings', loadChildren: () => import('app/modules/admin/pages/settings/settings.module').then(m => m.SettingsModule)},
            ]},

            // User Interface
            {path: 'ui', children: [

                // Material Components
                {path: 'material-components', loadChildren: () => import('app/modules/admin/ui/material-components/material-components.module').then(m => m.MaterialComponentsModule)},

                // Fuse Components
                {path: 'fuse-components', loadChildren: () => import('app/modules/admin/ui/fuse-components/fuse-components.module').then(m => m.FuseComponentsModule)},

                // Other Components
                {path: 'other-components', loadChildren: () => import('app/modules/admin/ui/other-components/other-components.module').then(m => m.OtherComponentsModule)},

                // TailwindCSS
                {path: 'tailwindcss', loadChildren: () => import('app/modules/admin/ui/tailwindcss/tailwindcss.module').then(m => m.TailwindCSSModule)},

                // Advanced Search
                {path: 'advanced-search', loadChildren: () => import('app/modules/admin/ui/advanced-search/advanced-search.module').then(m => m.AdvancedSearchModule)},

                // Animations
                {path: 'animations', loadChildren: () => import('app/modules/admin/ui/animations/animations.module').then(m => m.AnimationsModule)},

                 // Cards
                {path: 'cards', loadChildren: () => import('app/modules/admin/ui/cards/cards.module').then(m => m.CardsModule)},

                // Colors
                {path: 'colors', loadChildren: () => import('app/modules/admin/ui/colors/colors.module').then(m => m.ColorsModule)},

                // Confirmation Dialog
                {path: 'confirmation-dialog', loadChildren: () => import('app/modules/admin/ui/confirmation-dialog/confirmation-dialog.module').then(m => m.ConfirmationDialogModule)},

                // Datatable
                {path: 'datatable', loadChildren: () => import('app/modules/admin/ui/datatable/datatable.module').then(m => m.DatatableModule)},

                // Forms
                {path: 'forms', children: [
                    {path: 'fields', loadChildren: () => import('app/modules/admin/ui/forms/fields/fields.module').then(m => m.FormsFieldsModule)},
                    {path: 'layouts', loadChildren: () => import('app/modules/admin/ui/forms/layouts/layouts.module').then(m => m.FormsLayoutsModule)},
                    {path: 'wizards', loadChildren: () => import('app/modules/admin/ui/forms/wizards/wizards.module').then(m => m.FormsWizardsModule)}
                ]},

                // Icons
                {path: 'icons', loadChildren: () => import('app/modules/admin/ui/icons/icons.module').then(m => m.IconsModule)},

                // Page Layouts
                {path: 'page-layouts', loadChildren: () => import('app/modules/admin/ui/page-layouts/page-layouts.module').then(m => m.PageLayoutsModule)},

                // Typography
                {path: 'typography', loadChildren: () => import('app/modules/admin/ui/typography/typography.module').then(m => m.TypographyModule)}
            ]},

            // Documentation
            {path: 'docs', children: [

                // Changelog
                {path: 'changelog', loadChildren: () => import('app/modules/admin/docs/changelog/changelog.module').then(m => m.ChangelogModule)},

                // Guides
                {path: 'guides', loadChildren: () => import('app/modules/admin/docs/guides/guides.module').then(m => m.GuidesModule)}
            ]},

            // 404 & Catch all
            {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module)},
            {path: '**', redirectTo: '404-not-found'},
            {path: 'user1', loadChildren: () => import('app/layout/common/user/user.module').then(m => m.UserModule)},
        ]
    }
];
