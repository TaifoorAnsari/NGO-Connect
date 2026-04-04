// NGO-Connect Translation Module — English & Hindi
const translations = {
    en: {
        // Header / Nav
        'nav.our_causes': 'Our Causes',
        'nav.how_it_works': 'How It Works',
        'nav.impact': 'Impact',
        'nav.adopt': 'Adopt',
        'nav.track_reports': 'Track Reports',
        'nav.logout': 'Logout',
        'nav.login': 'Login',
        'nav.signup': 'Sign Up',
        'nav.back_dashboard': '← Back to Dashboard',

        // NGO List
        'ngo.loading': 'Loading NGOs...',
        'ngo.none': 'No NGOs registered yet in this category.',
        'ngo.reviews': 'reviews',
        'ngo.ai_trust': 'AI Trust',
        'ngo.rescues': 'Rescues',
        'ngo.call': 'Call NGO',
        'ngo.select': 'Select an NGO',
        'ngo.failed': 'Failed to load NGOs.',
        'ngo.status_verified': 'Verified',
        'ngo.status_caution': 'Caution',
        'ngo.status_suspicious': 'Suspicious',
        'ngo.programs': 'Programs:',
        'ngo.beneficiaries': 'beneficiaries',
        'ngo.raised': 'raised',
        'ngo.beds_total': 'Total Beds',
        'ngo.beds_available': 'Available',
        'ngo.beds_occupied': 'Occupied',
        'ngo.facilities_title': 'Facilities:',
        'ngo.special_care': 'Special Care:',
        'ngo.fac_kitchen': 'Kitchen',
        'ngo.fac_medical': 'Medical Room',
        'ngo.fac_garden': 'Garden',
        'ngo.fac_library': 'Library',
        'ngo.fac_recreation': 'Recreation',

        // Dashboard Sidebar
        'dash.active_alerts': 'Active Alerts',
        'dash.my_rescues': 'My Rescues',
        'dash.list_animals': 'List Animals',
        'dash.dashboard': 'Dashboard',
        'dash.donations': 'Donations',
        'dash.programs': 'Programs',
        'dash.facilities': 'Facilities',
        'dash.team': 'Team',
        'dash.reputation': 'Reputation',
        'dash.settings': 'Settings',
        'dash.logout': 'Logout',
        'dash.rescue_alerts': 'Rescue Alerts Dashboard',
        'dash.real_time': 'Real-time animal rescue reports in your area',
        'dash.active_count': 'Active Alerts',
        'dash.pending_reports': 'Pending reports',
        'dash.my_assignments': 'My Assignments',
        'dash.accepted_tasks': 'Accepted tasks',
        'dash.completed_label': 'Completed',
        'dash.total_rescues': 'Total rescues',
        'dash.response_time': 'Response Time',
        'dash.average_label': 'Average',
        'dash.area_map': 'Area Map',
        'dash.refresh': 'Refresh',
        'dash.active_feed': 'Active Rescue Alerts',
        'dash.loading_alerts': 'Loading rescue alerts...',
        'dash.all_clear': 'All Clear!',
        'dash.no_alerts': 'No active rescue alerts in your area right now.',
        'dash.my_accepted': 'My Accepted Rescues',
        'dash.no_rescues_yet': 'No accepted rescues yet',
        'dash.accept_to_see': 'Accept rescue alerts to see them here.',
        'dash.animals_adoption': 'Animals for Adoption',
        'dash.list_new': '+ List New Animal',
        'dash.click_to_add': 'Click "+ List New Animal" to add animals for adoption.',
        'dash.track_your_tasks': 'Track your accepted rescue tasks',
        'dash.manage_animals': 'Manage animals available for adoption',
        'dash.team_management': 'Team Management',
        'dash.manage_team': 'Manage your rescue team members',
        'dash.update_profile': 'Update your organization profile',
        'dash.donations_received': 'Donations Received',
        'dash.no_donations': 'No donations yet.',
        'dash.no_programs': 'No programs added.',
        'dash.add_program': '+ Add Program',
        'dash.no_team': 'No team members.',
        'dash.add_member': '+ Add Member',
        'dash.trust_score': 'AI Trust Score',
        'dash.how_score_calc': 'How your score is calculated',
        'dash.reviews_recent': 'Recent Community Reviews',
        'dash.no_reviews': 'No reviews yet.',
        'dash.save': 'Save',
        'dash.saved': 'Saved!',
        'dash.overview': 'Overview',
        'dash.manage_programs': 'Manage programs',
        'dash.manage_team_desc': 'Manage team',
        'dash.view_trust': 'View your AI score and reviews',
        'dash.view_donations': 'View donations',
        'dash.total_beds': 'Total Beds',
        'dash.available': 'Available',
        'dash.occupied': 'Occupied',
        'dash.facility_details': 'Facility Details',
        'dash.occupied_beds': 'Occupied Beds',
        'dash.facilities_avail': 'Facilities Available',
        'dash.kitchen': 'Kitchen',
        'dash.medical_room': 'Medical Room',
        'dash.garden': 'Garden',
        'dash.library': 'Library',
        'dash.recreation': 'Recreation',
        'dash.special_care': 'Special Care Notes',
        'dash.save_facilities': 'Save Facilities',
        'dash.overview_elderly': 'Overview of your elderly care facility',

        // Welcome
        'welcome.title': 'Welcome back,',
        'welcome.subtitle': 'Make a difference today — explore causes, adopt animals, or report emergencies.',

        // Quick Actions
        'action.report': '<span class="material-symbols-outlined">sos</span> Report Emergency',
        'action.adopt': '<span class="material-symbols-outlined">pets</span> Adopt a Pet',
        'action.track': '<span class="material-symbols-outlined">assignment</span> Track Reports',

        // Landing Page Hero
        'hero.title': 'Connect.<br /><span class="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">Care.</span> Change.',
        'hero.subtitle': 'A unified ecosystem connecting civilians with NGOs for instant rescue responses, community support, and meaningful impact.',
        'hero.report_btn': '<span class="material-symbols-outlined">sos</span> Quick Report - Injured Animal',
        'hero.dashboard_btn': 'NGO Dashboard →',

        // Causes
        'causes.title': 'Our Causes',
        'causes.subtitle': 'Explore and support different NGO categories',
        'causes.animal_title': 'Animal Welfare',
        'causes.animal_desc': 'Rescue injured animals, adopt pets, and support animal shelters with your donations.',
        'causes.elderly_title': 'Elderly Care',
        'causes.elderly_desc': 'Support old age homes with donations. View beds, facilities, and contribute supplies.',
        'causes.education_title': 'Education',
        'causes.education_desc': 'Empower underprivileged children with education. Donate for books, tuition, and resources.',
        'causes.explore': 'Explore →',
        'causes.animal_hero': 'Rescue injured animals, adopt pets, and support animal shelters in your community.',
        'causes.elderly_hero': 'Support old age homes with donations. View beds, facilities, and contribute supplies.',
        'causes.education_hero': 'Empower underprivileged children with education. Donate for books, tuition, and resources.',

        // Adoption
        'adoption.title': '<span class="material-symbols-outlined">pets</span> Adopt a Pet',
        'adoption.subtitle': 'Give a loving home to these adorable animals',
        'adoption.all': 'All',
        'adoption.dogs': '<span class="material-symbols-outlined">pets</span> Dogs',
        'adoption.cats': '<span class="material-symbols-outlined">pets</span> Cats',
        'adoption.birds': '<span class="material-symbols-outlined">flutter_dash</span> Birds',
        'adoption.rabbits': '<span class="material-symbols-outlined">cruelty_free</span> Rabbits',
        'adoption.loading': 'Loading available pets...',
        'adoption.none_title': 'No animals available',
        'adoption.none_desc': 'Check back soon — NGOs are always rescuing new animals!',
        'adoption.vaccinated': '<span class="material-symbols-outlined">medical_information</span> Vaccinated',
        'adoption.not_vaccinated': '<span class="material-symbols-outlined">warning</span> Not Vaccinated',
        'adoption.by': 'By',
        'adoption.adopt_btn': 'Adopt <span class="material-symbols-outlined">pets</span>',
        'adoption.confirm_title': 'Adopt',
        'adoption.confirm_msg': 'By confirming, you\'ll be registered as the adopter. The NGO will contact you for further procedures.',
        'adoption.confirm_yes': 'Yes, Adopt! <span class="material-symbols-outlined">favorite</span>',
        'adoption.confirm_cancel': 'Cancel',
        'adoption.success_title': 'Adoption Successful!',
        'adoption.success_btn': 'Great! <span class="material-symbols-outlined">celebration</span>',

        // Reports
        'reports.title': '<span class="material-symbols-outlined">assignment</span> Track Your Reports',
        'reports.subtitle': 'Follow every step — from reporting to resolution',
        'reports.total': 'Total Reports',
        'reports.pending': 'Pending',
        'reports.working': 'Under Work',
        'reports.resolved': 'Resolved',
        'reports.loading': 'Loading your reports...',
        'reports.none_title': 'No reports yet',
        'reports.none_desc': 'When you report an injured animal, you can track its progress here.',
        'reports.report_btn': 'Report an Emergency <span class="material-symbols-outlined">sos</span>',
        'reports.tracking': '<span class="material-symbols-outlined">track_changes</span> Tracking Progress',
        'reports.step_reported': 'Reported',
        'reports.step_accepted': 'Accepted',
        'reports.step_working': 'Under Work',
        'reports.step_resolved': 'Resolved',
        'reports.animal_type': 'Animal Type',
        'reports.priority': 'Priority',
        'reports.last_updated': 'Last updated:',
        'reports.cancelled': '<span class="material-symbols-outlined">cancel</span> This report has been cancelled',
        'reports.rate_title': '<span class="material-symbols-outlined">star</span> Rate your experience with',
        'reports.review_placeholder': 'Write a short review (optional)',
        'reports.submit_rating': 'Submit Rating',
        'reports.rating_success': '<span class="material-symbols-outlined">check_circle</span> Rating Submitted!',

        // Rewards
        'rewards.title': '<span class="material-symbols-outlined">emoji_events</span> Rewards & Achievements',
        'rewards.subtitle': 'Earn points and unlock badges by contributing to the community',
        'rewards.points': 'Total Points',
        'rewards.next_milestone': 'Next Milestone',
        'rewards.pts_away': 'pts away',
        'rewards.badge_bronze': 'Bronze Badge',
        'rewards.badge_silver': 'Silver Badge',
        'rewards.badge_gold': 'Gold Badge',
        'rewards.badge_locked': 'Locked',
        'rewards.badge_unlocked': 'Unlocked!',
        'rewards.certificate_btn': '<span class="material-symbols-outlined">history_edu</span> Download Certificate',
        'rewards.certificate_locked': 'Reach Gold (500 pts) to unlock certificate',
        'rewards.earn_report': '+50 pts for reporting',
        'rewards.earn_donate': '+30 pts for donating',
        'rewards.earn_adopt': '+100 pts for adopting',

        // Notifications
        'notify.badge_unlocked': 'Badge Unlocked!',
        'notify.points_earned': 'points earned!',

        // Footer
        'footer.text': '© 2024 NGO-Connect. All rights reserved. Built with <span class="material-symbols-outlined">favorite</span> for making a difference.',

        // Language toggle
        'lang.toggle': '<span class="material-symbols-outlined">language</span> हिंदी'
    },

    hi: {
        // Header / Nav
        'nav.our_causes': 'हमारे कारण',
        'nav.how_it_works': 'यह कैसे काम करता है',
        'nav.impact': 'प्रभाव',
        'nav.adopt': 'गोद लें',
        'nav.track_reports': 'रिपोर्ट ट्रैक करें',
        'nav.logout': 'लॉग आउट',
        'nav.login': 'लॉगिन',
        'nav.signup': 'साइन अप',
        'nav.back_dashboard': '← डैशबोर्ड पर वापस जाएं',

        // NGO List
        'ngo.loading': 'एनजीओ लोड हो रहे हैं...',
        'ngo.none': 'इस श्रेणी में अभी तक कोई एनजीओ पंजीकृत नहीं है।',
        'ngo.reviews': 'समीक्षाएं',
        'ngo.ai_trust': 'AI ट्रस्ट',
        'ngo.rescues': 'बचाव',
        'ngo.call': 'एनजीओ को कॉल करें',
        'ngo.select': 'एक एनजीओ चुनें',
        'ngo.failed': 'एनजीओ लोड करने में विफल।',
        'ngo.status_verified': 'सत्यापित',
        'ngo.status_caution': 'सावधानी',
        'ngo.status_suspicious': 'संदिग्ध',
        'ngo.programs': 'कार्यक्रम:',
        'ngo.beneficiaries': 'लाभार्थी',
        'ngo.raised': 'जुटाए गए',
        'ngo.beds_total': 'कुल बेड',
        'ngo.beds_available': 'उपलब्ध',
        'ngo.beds_occupied': 'भरा हुआ',
        'ngo.facilities_title': 'सुविधाएं:',
        'ngo.special_care': 'विशेष देखभाल:',
        'ngo.fac_kitchen': 'रसोई',
        'ngo.fac_medical': 'मेडिकल रूम',
        'ngo.fac_garden': 'बगीचा',
        'ngo.fac_library': 'पुस्तकालय',
        'ngo.fac_recreation': 'मनोरंजन',

        // Dashboard Sidebar
        'dash.active_alerts': 'सक्रिय अलर्ट',
        'dash.my_rescues': 'मेरे बचाव',
        'dash.list_animals': 'जानवरों की सूची',
        'dash.dashboard': 'डैशबोर्ड',
        'dash.donations': 'दान',
        'dash.programs': 'कार्यक्रम',
        'dash.facilities': 'सुविधाएं',
        'dash.team': 'टीम',
        'dash.reputation': 'प्रतिष्ठा',
        'dash.settings': 'सेटिंग्स',
        'dash.logout': 'लॉग आउट',
        'dash.rescue_alerts': 'बचाव अलर्ट डैशबोर्ड',
        'dash.real_time': 'आपके क्षेत्र में वास्तविक समय के पशु बचाव रिपोर्ट',
        'dash.active_count': 'सक्रिय अलर्ट',
        'dash.pending_reports': 'लंबित रिपोर्ट',
        'dash.my_assignments': 'मेरे असाइनमेंट',
        'dash.accepted_tasks': 'स्वीकृत कार्य',
        'dash.completed_label': 'पूरा हुआ',
        'dash.total_rescues': 'कुल बचाव',
        'dash.response_time': 'प्रतिक्रिया समय',
        'dash.average_label': 'औसत',
        'dash.area_map': 'क्षेत्र मानचित्र',
        'dash.refresh': 'रीफ्रेश',
        'dash.active_feed': 'सक्रिय बचाव अलर्ट',
        'dash.loading_alerts': 'बचाव अलर्ट लोड हो रहे हैं...',
        'dash.all_clear': 'सब साफ़!',
        'dash.no_alerts': 'अभी आपके क्षेत्र में कोई सक्रिय बचाव अलर्ट नहीं है।',
        'dash.my_accepted': 'मेरे स्वीकृत बचाव',
        'dash.no_rescues_yet': 'अभी तक कोई स्वीकृत बचाव नहीं',
        'dash.accept_to_see': 'उन्हें यहाँ देखने के लिए बचाव अलर्ट स्वीकार करें।',
        'dash.animals_adoption': 'गोद लेने के लिए जानवर',
        'dash.list_new': '+ नया जानवर सूचीबद्ध करें',
        'dash.click_to_add': 'गोद लेने के लिए जानवर जोड़ने के लिए "+ नया जानवर सूचीबद्ध करें" पर क्लिक करें।',
        'dash.track_your_tasks': 'अपने स्वीकृत बचाव कार्यों को ट्रैक करें',
        'dash.manage_animals': 'गोद लेने के लिए उपलब्ध जानवरों का प्रबंधन करें',
        'dash.team_management': 'टीम प्रबंधन',
        'dash.manage_team': 'अपने बचाव टीम के सदस्यों का प्रबंधन करें',
        'dash.update_profile': 'अपनी संस्था की प्रोफ़ाइल अपडेट करें',
        'dash.donations_received': 'प्राप्त दान',
        'dash.no_donations': 'अभी तक कोई दान नहीं।',
        'dash.no_programs': 'कोई कार्यक्रम नहीं जोड़ा गया।',
        'dash.add_program': '+ कार्यक्रम जोड़ें',
        'dash.no_team': 'कोई टीम सदस्य नहीं।',
        'dash.add_member': '+ सदस्य जोड़ें',
        'dash.trust_score': 'AI ट्रस्ट स्कोर',
        'dash.how_score_calc': 'आपका स्कोर कैसे गिना जाता है',
        'dash.reviews_recent': 'हाल की सामुदायिक समीक्षाएं',
        'dash.no_reviews': 'अभी तक कोई समीक्षा नहीं।',
        'dash.save': 'सहेजें',
        'dash.saved': 'सहेजा गया!',
        'dash.overview': 'अवलोकन',
        'dash.manage_programs': 'कार्यक्रमों का प्रबंधन करें',
        'dash.manage_team_desc': 'टीम का प्रबंधन करें',
        'dash.view_trust': 'अपना AI स्कोर और समीक्षाएं देखें',
        'dash.view_donations': 'दान देखें',
        'dash.total_beds': 'कुल बिस्तर',
        'dash.available': 'उपलब्ध',
        'dash.occupied': 'अधिकृत',
        'dash.facility_details': 'सुविधा विवरण',
        'dash.occupied_beds': 'भरे हुए बिस्तर',
        'dash.facilities_avail': 'उपलब्ध सुविधाएं',
        'dash.kitchen': 'रसोई',
        'dash.medical_room': 'मेडिकल रूम',
        'dash.garden': 'बगीचा',
        'dash.library': 'पुस्तकालय',
        'dash.recreation': 'मनोरंजन',
        'dash.special_care': 'विशेष देखभाल नोट्स',
        'dash.save_facilities': 'सुविधाएं सहेजें',
        'dash.overview_elderly': 'आपकी बुजुर्ग देखभाल सुविधा का अवलोकन',

        // Welcome
        'welcome.title': 'वापस स्वागत है,',
        'welcome.subtitle': 'आज कुछ अच्छा करें — कारणों को जानें, जानवरों को गोद लें, या आपातकाल की रिपोर्ट करें।',

        // Quick Actions
        'action.report': '<span class="material-symbols-outlined">sos</span> आपातकाल रिपोर्ट',
        'action.adopt': '<span class="material-symbols-outlined">pets</span> पालतू गोद लें',
        'action.track': '<span class="material-symbols-outlined">assignment</span> रिपोर्ट ट्रैक करें',

        // Landing Page Hero
        'hero.title': 'जुड़ें।<br /><span class="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">देखभाल।</span> बदलाव।',
        'hero.subtitle': 'नागरिकों को त्वरित बचाव प्रतिक्रियाओं, सामुदायिक समर्थन और सार्थक प्रभाव के लिए एनजीओ के साथ जोड़ने वाला एक एकीकृत पारिस्थितिकी तंत्र।',
        'hero.report_btn': '<span class="material-symbols-outlined">sos</span> त्वरित रिपोर्ट - घायल जानवर',
        'hero.dashboard_btn': 'एनजीओ डैशबोर्ड →',

        // Causes
        'causes.title': 'हमारे कारण',
        'causes.subtitle': 'विभिन्न एनजीओ श्रेणियों का समर्थन करें',
        'causes.animal_title': 'पशु कल्याण',
        'causes.animal_desc': 'घायल जानवरों को बचाएं, पालतू जानवरों को गोद लें और अपने दान से पशु आश्रयों का समर्थन करें।',
        'causes.elderly_title': 'वृद्ध देखभाल',
        'causes.elderly_desc': 'वृद्धाश्रमों को दान से सहायता करें। बिस्तर, सुविधाएं देखें और आपूर्ति दान करें।',
        'causes.education_title': 'शिक्षा',
        'causes.education_desc': 'वंचित बच्चों को शिक्षा से सशक्त बनाएं। किताबें, ट्यूशन और संसाधनों के लिए दान करें।',
        'causes.explore': 'जानें →',
        'causes.animal_hero': 'अपने समुदाय में घायल जानवरों को बचाएं, पालतू जानवरों को गोद लें और पशु आश्रयों का समर्थन करें।',
        'causes.elderly_hero': 'वृद्धाश्रमों को दान से सहायता करें। बिस्तर, सुविधाएं देखें और आपूर्ति दान करें।',
        'causes.education_hero': 'वंचित बच्चों को शिक्षा से सशक्त बनाएं। किताबें, ट्यूशन और संसाधनों के लिए दान करें।',

        // Adoption
        'adoption.title': '<span class="material-symbols-outlined">pets</span> पालतू गोद लें',
        'adoption.subtitle': 'इन प्यारे जानवरों को एक नया घर दें',
        'adoption.all': 'सभी',
        'adoption.dogs': '<span class="material-symbols-outlined">pets</span> कुत्ते',
        'adoption.cats': '<span class="material-symbols-outlined">pets</span> बिल्लियाँ',
        'adoption.birds': '<span class="material-symbols-outlined">flutter_dash</span> पक्षी',
        'adoption.rabbits': '<span class="material-symbols-outlined">cruelty_free</span> खरगोश',
        'adoption.loading': 'पालतू जानवर लोड हो रहे हैं...',
        'adoption.none_title': 'कोई जानवर उपलब्ध नहीं',
        'adoption.none_desc': 'जल्द ही वापस आएं — एनजीओ हमेशा नए जानवरों को बचा रहे हैं!',
        'adoption.vaccinated': '<span class="material-symbols-outlined">medical_information</span> टीकाकृत',
        'adoption.not_vaccinated': '<span class="material-symbols-outlined">warning</span> टीकाकृत नहीं',
        'adoption.by': 'द्वारा',
        'adoption.adopt_btn': 'गोद लें <span class="material-symbols-outlined">pets</span>',
        'adoption.confirm_title': 'गोद लें',
        'adoption.confirm_msg': 'पुष्टि करने पर, आप गोद लेने वाले के रूप में पंजीकृत होंगे। एनजीओ आगे की प्रक्रिया के लिए आपसे संपर्क करेगा।',
        'adoption.confirm_yes': 'हाँ, गोद लें! <span class="material-symbols-outlined">favorite</span>',
        'adoption.confirm_cancel': 'रद्द करें',
        'adoption.success_title': 'गोद लेना सफल!',
        'adoption.success_btn': 'बहुत बढ़िया! <span class="material-symbols-outlined">celebration</span>',

        // Reports
        'reports.title': '<span class="material-symbols-outlined">assignment</span> अपनी रिपोर्ट ट्रैक करें',
        'reports.subtitle': 'हर कदम का पालन करें — रिपोर्ट से समाधान तक',
        'reports.total': 'कुल रिपोर्ट',
        'reports.pending': 'लंबित',
        'reports.working': 'कार्य में',
        'reports.resolved': 'हल हो गया',
        'reports.loading': 'आपकी रिपोर्ट लोड हो रही हैं...',
        'reports.none_title': 'अभी कोई रिपोर्ट नहीं',
        'reports.none_desc': 'जब आप किसी घायल जानवर की रिपोर्ट करेंगे, तो यहाँ उसकी प्रगति देख सकते हैं।',
        'reports.report_btn': 'आपातकाल रिपोर्ट करें <span class="material-symbols-outlined">sos</span>',
        'reports.tracking': '<span class="material-symbols-outlined">track_changes</span> प्रगति ट्रैकिंग',
        'reports.step_reported': 'रिपोर्ट किया',
        'reports.step_accepted': 'स्वीकृत',
        'reports.step_working': 'कार्य में',
        'reports.step_resolved': 'हल हो गया',
        'reports.animal_type': 'जानवर का प्रकार',
        'reports.priority': 'प्राथमिकता',
        'reports.last_updated': 'अंतिम अपडेट:',
        'reports.cancelled': '<span class="material-symbols-outlined">cancel</span> यह रिपोर्ट रद्द कर दी गई है',
        'reports.rate_title': '<span class="material-symbols-outlined">star</span> अपना अनुभव रेट करें',
        'reports.review_placeholder': 'एक छोटी समीक्षा लिखें (वैकल्पिक)',
        'reports.submit_rating': 'रेटिंग सबमिट करें',
        'reports.rating_success': '<span class="material-symbols-outlined">check_circle</span> रेटिंग सबमिट हो गई!',

        // Rewards
        'rewards.title': '<span class="material-symbols-outlined">emoji_events</span> पुरस्कार और उपलब्धियाँ',
        'rewards.subtitle': 'समुदाय में योगदान देकर अंक अर्जित करें और बैज अनलॉक करें',
        'rewards.points': 'कुल अंक',
        'rewards.next_milestone': 'अगला लक्ष्य',
        'rewards.pts_away': 'अंक शेष',
        'rewards.badge_bronze': 'कांस्य बैज',
        'rewards.badge_silver': 'रजत बैज',
        'rewards.badge_gold': 'स्वर्ण बैज',
        'rewards.badge_locked': 'लॉक',
        'rewards.badge_unlocked': 'अनलॉक!',
        'rewards.certificate_btn': '<span class="material-symbols-outlined">history_edu</span> प्रमाणपत्र डाउनलोड करें',
        'rewards.certificate_locked': 'प्रमाणपत्र के लिए स्वर्ण (500 अंक) तक पहुँचें',
        'rewards.earn_report': 'रिपोर्ट के लिए +50 अंक',
        'rewards.earn_donate': 'दान के लिए +30 अंक',
        'rewards.earn_adopt': 'गोद लेने के लिए +100 अंक',

        // Notifications
        'notify.badge_unlocked': 'बैज अनलॉक हुआ!',
        'notify.points_earned': 'अंक अर्जित!',

        // Footer
        'footer.text': '© 2024 एनजीओ-कनेक्ट। सभी अधिकार सुरक्षित। <span class="material-symbols-outlined">favorite</span> के साथ बदलाव के लिए बनाया गया।',

        // Language toggle
        'lang.toggle': '<span class="material-symbols-outlined">language</span> English'
    }
};

// Translation helper
function t(key) {
    const lang = localStorage.getItem('preferredLanguage') || 'en';
    return (translations[lang] && translations[lang][key]) || (translations.en[key]) || key;
}

// Apply translations to all elements with data-i18n attribute
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = t(key);
        if (el.tagName === 'INPUT' && el.type !== 'submit') {
            el.placeholder = text;
        } else {
            el.innerHTML = text;
        }
    });
}

// Toggle language
function toggleLanguage() {
    const current = localStorage.getItem('preferredLanguage') || 'en';
    const next = current === 'en' ? 'hi' : 'en';
    localStorage.setItem('preferredLanguage', next);

    // Save to server if logged in
    const userId = localStorage.getItem('userId');
    if (userId) {
        fetch(`${window.location.origin}/api/users/${userId}/language`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: next })
        }).catch(err => console.error('Language save error:', err));
    }

    // Re-apply translations
    applyTranslations();

    // Notify pages that language changed (for dynamic content)
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: next } }));

    // Update toggle button text
    const toggleBtn = document.getElementById('langToggleBtn');
    if (toggleBtn) toggleBtn.innerHTML = t('lang.toggle');
}
