import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Sidebar Menu List
const UserAdd = React.lazy(() => import('./views/user-management/AddUser'))
const UserEdit = React.lazy(() => import('./views/user-management/EditUser'))
const ProfileManagement = React.lazy(() => import('./views/sidebarMenu/ProfileManagement'))
const Notifications = React.lazy(() => import('./views/sidebarMenu/Notification'))
const BusinessSetting = React.lazy(() => import('./views/pages/setting/BusinessSetting'))
const SubscriptionList = React.lazy(() => import('./views/sidebarMenu/Subscription'))
const viewSubscriber = React.lazy(() => import('./views/pages/subscription/ViewSubscriber'))
const TransactionsList = React.lazy(() => import('./views/sidebarMenu/Transactions'))

const TeacherList = React.lazy(() => import('./views/admin-views/teacher-management/TeacherList'))
const TeacherView = React.lazy(() => import('./views/admin-views/teacher-management/ViewTeacher'))
const TeacherAdd = React.lazy(() => import('./views/admin-views/teacher-management/AddTeacher'))
const TeacherEdit = React.lazy(() => import('./views/admin-views/teacher-management/EditTeacher'))

const notesList = React.lazy(() => import('./views/notes/notesList'))
const notesEdit = React.lazy(() => import('./views/notes/notesEdit'))

const quizList = React.lazy(() => import('./views/quiz/quizList'))
const quizCreate = React.lazy(() => import('./views/quiz/quizCreate'))
const quizEdit = React.lazy(() => import('./views/quiz/quizEdit'))

const calculatorList = React.lazy(() => import('./views/calculator/calculatorList'))
const calculatorCreate = React.lazy(() => import('./views/calculator/calculatorCreate'))
const calculatorEdit = React.lazy(() => import('./views/calculator/calculatorEdit'))

const cheatsheetList = React.lazy(() => import('./views/cheat-sheet/cheatsheetList'))
const cheatsheetCreate = React.lazy(() => import('./views/cheat-sheet/cheatsheetCreate'))
const cheatsheetEdit = React.lazy(() => import('./views/cheat-sheet/cheatsheetEdit'))

const PlanList = React.lazy(() => import('./views/pages/plan/PlanList'))
const PlanAdd = React.lazy(() => import('./views/pages/plan/PlanAdd'))
const PlanView = React.lazy(() => import('./views/pages/plan/PlanView'))
const PlanEdit = React.lazy(() => import('./views/pages/plan/PlanEdit'))

const GenreList = React.lazy(() => import('./views/pages/genre/GenreList'))
const GenreAdd = React.lazy(() => import('./views/pages/genre/GenreAdd'))
const GenreView = React.lazy(() => import('./views/pages/genre/GenreView'))
const GenreEdit = React.lazy(() => import('./views/pages/genre/GenreEdit'))

const BannerList = React.lazy(() => import('./views/pages/banner/BannerList'))
const BannerAdd = React.lazy(() => import('./views/pages/banner/BannerAdd'))
const BannerView = React.lazy(() => import('./views/pages/banner/BannerView'))
const BannerEdit = React.lazy(() => import('./views/pages/banner/BannerEdit'))

const ClassList = React.lazy(() => import('./views/pages/class/ClassList'))
const ClassAdd = React.lazy(() => import('./views/pages/class/ClassAdd'))
const ClassView = React.lazy(() => import('./views/pages/class/ClassView'))
const ClassEdit = React.lazy(() => import('./views/pages/class/ClassEdit'))

//User Quizz Attempt

const UserQuizzAttempt = React.lazy(()=> import('./views/admin-views/Result/QuizAttemptsList'))
const QuizResultView = React.lazy(()=> import ('./views/admin-views/Result/QuizResultView'))

// Feedback pages
const FeedbackList = React.lazy(() => import('./views/pages/feedback/FeedbackList'))
const FeedbackView = React.lazy(() => import('./views/pages/feedback/FeedbackView'))

const ReelsList = React.lazy(() => import('./views/pages/reels/ReelsList'))
const ReelsAdd = React.lazy(() => import('./views/pages/reels/ReelsAdd'))
const ReelsView = React.lazy(() => import('./views/pages/reels/ReelsView'))
const ReelsEdit = React.lazy(() => import('./views/pages/reels/ReelsEdit'))

const PushNotification = React.lazy(() => import('./views/pages/push-notification/Create'))
const NotificationList = React.lazy(() => import('./views/pages/push-notification/NotificationList'))

const PageList = React.lazy(() => import('./views/pages/static-pages/PageList'))
const PageEdit = React.lazy(() => import('./views/pages/static-pages/PageEdit'))

const LanguageList = React.lazy(() => import('./views/pages/app-language/List'))
const LanguageCreate = React.lazy(() => import('./views/pages/app-language/Create'))
const LanguageEdit = React.lazy(() => import('./views/pages/app-language/Edit'))

const SeriesList = React.lazy(() => import('./views/pages/series/List'))
const SeriesAdd = React.lazy(() => import('./views/pages/series/Create'))
const SeriesEdit = React.lazy(() => import('./views/pages/series/Edit'))

const EpisodeList = React.lazy(() => import('./views/pages/episodes/List'))
const EpisodeAdd = React.lazy(() => import('./views/pages/episodes/Create'))
const EpisodeEdit = React.lazy(() => import('./views/pages/episodes/Edit'))

const ContentLanguageList = React.lazy(() => import('./views/pages/content-language/List'))
const ContentLanguageEdit = React.lazy(() => import('./views/pages/content-language/Edit'))
const ContentLanguageCreate = React.lazy(() => import('./views/pages/content-language/Create'))

const Community = React.lazy(() => import('./views/sidebarMenu/Community'))
const History = React.lazy(() => import('./views/user-management/History'))
const Profile = React.lazy(() => import('./views/sidebarMenu/profile'))
const Wishlist = React.lazy(() => import('./views/user-management/Wishlist'))

// User Management
const NotificationView = React.lazy(() => import('./views/user-management/NotificationView'))
const ViewUser = React.lazy(() => import('./views/user-management/ViewUser'))
const EditUSer = React.lazy(() => import('./views/user-management/EditUser'))
const PaymentManagement = React.lazy(() => import('./views/user-management/PaymentManagement'))
const TermsCondition = React.lazy(() => import('./views/user-management/TermsCondition'))
const Faq = React.lazy(() => import('./views/user-management/Faq'))
const PrivacyPolicy = React.lazy(() => import('./views/user-management/PrivacyPolicy'))
const AddFaq = React.lazy(() => import('./views/pages/faqs/AddFaq'))
const EditFaq = React.lazy(() => import('./views/pages/faqs/EditFaq'))
const AboutUs = React.lazy(() => import('./views/user-management/AboutUs'))
const ContentUpload = React.lazy(() => import('./views/user-management/ContentUpload'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

//Questions
const QuestionList = React.lazy(() => import('./views/admin-views/question/QuestionList'))
const QuestionView = React.lazy(() => import('./views/admin-views/question/QuestionView'))
const QuestionAdd = React.lazy(() => import('./views/admin-views/question/QuestionAdd'))
const QuestionEdit = React.lazy(() => import('./views/admin-views/question/QuestionEdit'))

//Quiz
const QuizList = React.lazy(() => import('./views/admin-views/quiz/QuizList'))
const QuizView = React.lazy(() => import('./views/admin-views/quiz/QuizView'))
const QuizAdd = React.lazy(() => import('./views/admin-views/quiz/QuizAdd'))
const QuizEdit = React.lazy(() => import('./views/admin-views/quiz/QuizEdit'))

//Chapter
const ChapterList = React.lazy(() => import('./views/admin-views/chapter/ChapterList'))
const ChapterView = React.lazy(() => import('./views/admin-views/chapter/ChapterView'))
const ChapterAdd = React.lazy(() => import('./views/admin-views/chapter/ChapterAdd'))
const ChapterEdit = React.lazy(() => import('./views/admin-views/chapter/ChapterEdit'))

//Topic
const TopicList = React.lazy(() => import('./views/admin-views/topic/TopicList'))
const TopicView = React.lazy(() => import('./views/admin-views/topic/TopicView'))
const TopicAdd = React.lazy(() => import('./views/admin-views/topic/TopicAdd'))
const TopicEdit = React.lazy(() => import('./views/admin-views/topic/TopicEdit'))

//Section
const SectionList = React.lazy(() => import('./views/admin-views/section/SectionList'))
const SectionView = React.lazy(() => import('./views/admin-views/section/SectionView'))
const SectionAdd = React.lazy(() => import('./views/admin-views/section/SectionAdd'))
const SectionEdit = React.lazy(() => import('./views/admin-views/section/SectionEdit'))

//SubSection
const SubSectionList = React.lazy(() => import('./views/admin-views/sub-section/SubSectionList'))
const SubSectionView = React.lazy(() => import('./views/admin-views/sub-section/SubSectionView'))
const SubSectionAdd = React.lazy(() => import('./views/admin-views/sub-section/SubSectionAdd'))
const SubSectionEdit = React.lazy(() => import('./views/admin-views/sub-section/SubSectionEdit'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },

  { path: '/teachers', name: 'Teachers List', element: TeacherList },
  { path: '/view-teacher/:id', name: 'Teachers View', element: TeacherView },
  { path: '/add-teacher', name: 'Teachers Add', element: TeacherAdd },
  { path: '/edit-teacher/:id', name: 'Teachers Edit', element: TeacherEdit },


  
  // { path: '/teachers/view/:id', name: 'Teachers', element: TeacherEdit },

  { path: '/users', name: 'ProfileManagement', element: ProfileManagement },
  { path: '/user-add', name: 'UserAdd', element: UserAdd },
  { path: '/view-user/:id', name: 'ViewUser', element: ViewUser },
  { path: '/edit-user', name: 'Edit User', element: EditUSer },
  { path: '/users/:id', name: 'ProfileManagement', element: UserEdit },

  { path: '/subscribers', name: 'Subscription', element: SubscriptionList },
  { path: '/view-subscriber', name: 'view-subscriber', element: viewSubscriber },
  { path: '/transactions', name: 'Transactions', element: TransactionsList },

  { path: '/notification', name: 'Notifications', element: Notifications },

  { path: '/saved-notes', name: 'Saved Notes', element: notesList },
  { path: '/saved-notes/view/:id', name: 'View', element: notesEdit },

  { path: '/quizzes', name: 'Quiz', element: quizList },
  { path: '/quizzes/create', name: 'Create', element: quizCreate },
  { path: '/quizzes/edit', name: 'Edit', element: quizEdit },

  { path: '/calculator', name: 'Calculator', element: calculatorList },
  { path: '/calculator/create', name: 'Create', element: calculatorCreate },
  { path: '/calculator/edit/:id', name: 'Edit', element: calculatorEdit },

  { path: '/cheat-sheet', name: 'Cheat Sheet', element: cheatsheetList },
  { path: '/cheat-sheet/create', name: 'Create', element: cheatsheetCreate },
  { path: '/cheat-sheet/edit/:id', name: 'Edit', element: cheatsheetEdit },

  { path: '/subscription', name: 'Subscription', element: PlanList },
  { path: '/plan-view/:id', name: 'PlanView', element: PlanView },
  { path: '/plan-add', name: 'PlanAdd', element: PlanAdd },
  { path: '/plan-edit/:id', name: 'PlanEdit', element: PlanEdit },

  { path: '/genre-list', name: 'GenreList', element: GenreList },
  { path: '/genre-view/:id', name: 'GenreView', element: GenreView },
  { path: '/genre-add', name: 'GenreAdd', element: GenreAdd },
  { path: '/genre-edit/:id', name: 'GenreEdit', element: GenreEdit },

  { path: '/banner-list', name: 'BannerList', element: BannerList },
  { path: '/banner-view/:id', name: 'BannerView', element: BannerView },
  { path: '/banner-add', name: 'BannerAdd', element: BannerAdd },
  { path: '/banner-edit/:id', name: 'BannerEdit', element: BannerEdit },

  // Questions Routes
  { path: '/question-list', name: 'QuestionList', element: QuestionList },
  { path: '/question-view/:id', name: 'QuestionView', element: QuestionView },
  { path: '/question-add', name: 'QuestionAdd', element: QuestionAdd },
  { path: '/question-edit/:id', name: 'QuestionEdit', element: QuestionEdit },

  // Quiz Routes
  { path: '/quiz-list', name: 'QuizList', element: QuizList },
  { path: '/quiz-view/:id', name: 'QuizView', element: QuizView },
  { path: '/quiz-add', name: 'QuizAdd', element: QuizAdd },
  { path: '/quiz-edit/:id', name: 'QuizEdit', element: QuizEdit },

  //Chapter Routes
  { path: '/chapter-list', name: 'ChapterList', element: ChapterList },
  { path: '/chapter-view/:id', name: 'ChapterView', element: ChapterView },
  { path: '/chapter-add', name: 'ChapterAdd', element: ChapterAdd },
  { path: '/chapter-edit/:id', name: 'ChapterEdit', element: ChapterEdit },

  //Topic Routes
  { path: '/topic-list', name: 'TopicList', element: TopicList },
  { path: '/topic-view/:id', name: 'TopicView', element: TopicView },
  { path: '/topic-add', name: 'TopicAdd', element: TopicAdd },
  { path: '/topic-edit/:id', name: 'TopicEdit', element: TopicEdit },

  //Section Routes
  { path: '/section-list', name: 'SectionList', element: SectionList },
  { path: '/section-view/:id', name: 'SectionView', element: SectionView },
  { path: '/section-add', name: 'SectionAdd', element: SectionAdd },
  { path: '/section-edit/:id', name: 'SectionEdit', element: SectionEdit },

  //Sub Section Routes
  { path: '/subsection-list', name: 'SubSectionList', element: SubSectionList },
  { path: '/subsection-view/:id', name: 'SubSectionView', element: SubSectionView },
  { path: '/subsection-add', name: 'SubSectionAdd', element: SubSectionAdd },
  { path: '/subsection-edit/:id', name: 'SubSectionEdit', element: SubSectionEdit },

  // Classes Routes
  { path: '/class-list', name: 'ClassList', element: ClassList },
  { path: '/class-view/:id', name: 'ClassView', element: ClassView },
  { path: '/class-add', name: 'ClassAdd', element: ClassAdd },
  { path: '/class-edit/:id', name: 'ClassEdit', element: ClassEdit },
  
  //User Quizz Attempts
  {path: '/quiz-attempts/:quizId', name: 'Quiz Attempt' , element: UserQuizzAttempt},
  { path:'/quiz-result/:attemptId', name: 'Result View' , element:QuizResultView  },


  // feedbacks
  { path: '/feedback-list', name: 'FeedbackList', element: FeedbackList },
  { path: '/feedback-view/:id', name: 'FeedbackView', element: FeedbackView },

  { path: '/reels-list', name: 'ReelsList', element: ReelsList },
  { path: '/reels-add', name: 'ReelsAdd', element: ReelsAdd },
  { path: '/reels-edit/:id', name: 'ReelsEdit', element: ReelsEdit },
  { path: '/reels-view/:id', name: 'ReelsView', element: ReelsView },
  { path: '/community', name: 'Community', element: Community },

  { path: '/notification-view', name: 'Notification View', element: NotificationView },
  { path: '/payment-management', name: 'Payment Management ', element: PaymentManagement },
  { path: '/settings', name: 'Setting ', element: BusinessSetting },

  { path: '/faq', name: 'FAQ ', element: Faq },
  { path: '/add-faq', name: 'Add FAQ ', element: AddFaq },
  { path: '/edit-faq/:id', name: 'Add FAQ ', element: EditFaq },

  { path: '/languages', name: 'Language', element: LanguageList },
  { path: '/add-languages', name: 'Language', element: LanguageCreate },
  { path: '/edit-languages/:id', name: 'Language', element: LanguageEdit },

  { path: '/content-languages', name: 'Content Language', element: ContentLanguageList },
  { path: '/add-content-languages', name: 'Content Language', element: ContentLanguageCreate },
  { path: '/edit-content-languages/:id', name: 'Content Language', element: ContentLanguageEdit },

  { path: '/pages', name: 'Static Pages', element: PageList },
  { path: '/page-edit/:id', name: 'Static Pages', element: PageEdit },

  { path: '/push-notification', name: 'Push Notification', element: PushNotification },
  { path: '/notification-list', name: 'Notification List', element: NotificationList },

  { path: '/series', name: 'Series', element: SeriesList },
  { path: '/add-series', name: 'Add Series', element: SeriesAdd },
  { path: '/edit-series/:id', name: 'Edit Series', element: SeriesEdit },

  { path: '/series-episodes/:series_id', name: 'Series - Episodes', element: EpisodeList },
  { path: '/add-series-episodes/:series_id', name: 'Add Series - Episodes', element: EpisodeAdd },
  {
    path: '/edit-series-episodes/:series_id/:id',
    name: 'Edit Series - Episodes',
    element: EpisodeEdit,
  },

  { path: '/history', name: 'Watch History ', element: History },
  { path: '/content-upload', name: 'Content Upload ', element: ContentUpload },
  { path: '/profile', name: 'Profile ', element: Profile },
  { path: '/wishlist', name: 'Wishlist ', element: Wishlist },
]

export default routes
