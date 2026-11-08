/** V65: manually curated dish identities, images and recognized country associations.
 * Generic filename-only images and contested nationality dishes are held for editorial review.
 * This file contains data only. Its source is docs/V65_FOOD_IMAGE_AUDIT.json.
 */
import type { FoodOriginQuestion } from './food-origin-content';
export const FOOD_ORIGIN_UPLOAD_QUESTIONS: FoodOriginQuestion[] = [
  {
    "id": "food_new_peking_duck_cn",
    "answer": "CN",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Peking Duck",
      "ar": "بط بكين"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_peking_duck_cn.jpg",
    "imageAlt": "Peking Duck food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "TW",
        "label": {
          "en": "Taiwan",
          "ar": "تايوان"
        }
      },
      {
        "countryCode": "MN",
        "label": {
          "en": "Mongolia",
          "ar": "منغوليا"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "PH",
        "label": {
          "en": "Philippines",
          "ar": "الفلبين"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "ID",
        "label": {
          "en": "Indonesia",
          "ar": "إندونيسيا"
        }
      },
      {
        "countryCode": "MY",
        "label": {
          "en": "Malaysia",
          "ar": "ماليزيا"
        }
      },
      {
        "countryCode": "SG",
        "label": {
          "en": "Singapore",
          "ar": "سنغافورة"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "ZA",
        "label": {
          "en": "South Africa",
          "ar": "جنوب أفريقيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "meat",
      "east_asia"
    ],
    "similarityGroup": "food_new_peking_duck_cn",
    "distractorNearCodes": [
      "KR",
      "JP",
      "TW",
      "MN",
      "VN",
      "PH",
      "TH",
      "ID",
      "MY",
      "SG"
    ],
    "distractorFarCodes": [
      "TR",
      "DE",
      "GR",
      "EG",
      "SA",
      "BR",
      "US",
      "IN",
      "FR",
      "ZA"
    ]
  },
  {
    "id": "food_new_koshary_eg",
    "answer": "EG",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Koshary",
      "ar": "كشري"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_koshary_eg.jpg",
    "imageAlt": "Koshary food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "LY",
        "label": {
          "en": "Libya",
          "ar": "ليبيا"
        }
      },
      {
        "countryCode": "TN",
        "label": {
          "en": "Tunisia",
          "ar": "تونس"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "SD",
        "label": {
          "en": "Sudan",
          "ar": "السودان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "DZ",
        "label": {
          "en": "Algeria",
          "ar": "الجزائر"
        }
      },
      {
        "countryCode": "JO",
        "label": {
          "en": "Jordan",
          "ar": "الأردن"
        }
      },
      {
        "countryCode": "LB",
        "label": {
          "en": "Lebanon",
          "ar": "لبنان"
        }
      },
      {
        "countryCode": "SY",
        "label": {
          "en": "Syria",
          "ar": "سوريا"
        }
      },
      {
        "countryCode": "PS",
        "label": {
          "en": "Palestine",
          "ar": "فلسطين"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "ID",
        "label": {
          "en": "Indonesia",
          "ar": "إندونيسيا"
        }
      },
      {
        "countryCode": "MY",
        "label": {
          "en": "Malaysia",
          "ar": "ماليزيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      }
    ],
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "rice",
      "north_africa"
    ],
    "similarityGroup": "food_new_koshary_eg",
    "distractorNearCodes": [
      "LY",
      "TN",
      "MA",
      "SD",
      "SA",
      "DZ",
      "JO",
      "LB",
      "SY",
      "PS"
    ],
    "distractorFarCodes": [
      "IN",
      "PK",
      "TR",
      "ID",
      "MY",
      "JP",
      "CN",
      "TH",
      "VN",
      "BR"
    ]
  },
  {
    "id": "food_new_bouillabaisse_fr",
    "answer": "FR",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Bouillabaisse",
      "ar": "بويابيس"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_bouillabaisse_fr.jpg",
    "imageAlt": "Bouillabaisse food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "BE",
        "label": {
          "en": "Belgium",
          "ar": "بلجيكا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "CH",
        "label": {
          "en": "Switzerland",
          "ar": "سويسرا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "NL",
        "label": {
          "en": "Netherlands",
          "ar": "هولندا"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "IE",
        "label": {
          "en": "Ireland",
          "ar": "أيرلندا"
        }
      },
      {
        "countryCode": "LU",
        "label": {
          "en": "Luxembourg",
          "ar": "لوكسمبورغ"
        }
      },
      {
        "countryCode": "AT",
        "label": {
          "en": "Austria",
          "ar": "النمسا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "PT",
        "label": {
          "en": "Portugal",
          "ar": "البرتغال"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "PH",
        "label": {
          "en": "Philippines",
          "ar": "الفلبين"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "seafood",
      "western_europe"
    ],
    "similarityGroup": "food_new_bouillabaisse_fr",
    "distractorNearCodes": [
      "BE",
      "DE",
      "CH",
      "IT",
      "ES",
      "NL",
      "GB",
      "IE",
      "LU",
      "AT"
    ],
    "distractorFarCodes": [
      "JP",
      "GR",
      "TH",
      "EG",
      "PT",
      "KR",
      "PH",
      "VN",
      "US",
      "IN"
    ]
  },
  {
    "id": "food_new_khichdi_in",
    "answer": "IN",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Khichdi",
      "ar": "خيتشدي"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_khichdi_in.jpg",
    "imageAlt": "Khichdi food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "BD",
        "label": {
          "en": "Bangladesh",
          "ar": "بنغلاديش"
        }
      },
      {
        "countryCode": "NP",
        "label": {
          "en": "Nepal",
          "ar": "نيبال"
        }
      },
      {
        "countryCode": "LK",
        "label": {
          "en": "Sri Lanka",
          "ar": "سريلانكا"
        }
      },
      {
        "countryCode": "AF",
        "label": {
          "en": "Afghanistan",
          "ar": "أفغانستان"
        }
      },
      {
        "countryCode": "BT",
        "label": {
          "en": "Bhutan",
          "ar": "بوتان"
        }
      },
      {
        "countryCode": "MV",
        "label": {
          "en": "Maldives",
          "ar": "جزر المالديف"
        }
      },
      {
        "countryCode": "UZ",
        "label": {
          "en": "Uzbekistan",
          "ar": "أوزبكستان"
        }
      },
      {
        "countryCode": "KG",
        "label": {
          "en": "Kyrgyzstan",
          "ar": "قيرغيزستان"
        }
      },
      {
        "countryCode": "TJ",
        "label": {
          "en": "Tajikistan",
          "ar": "طاجيكستان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "ID",
        "label": {
          "en": "Indonesia",
          "ar": "إندونيسيا"
        }
      },
      {
        "countryCode": "MY",
        "label": {
          "en": "Malaysia",
          "ar": "ماليزيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "rice",
      "south_asia"
    ],
    "similarityGroup": "food_new_khichdi_in",
    "distractorNearCodes": [
      "PK",
      "BD",
      "NP",
      "LK",
      "AF",
      "BT",
      "MV",
      "UZ",
      "KG",
      "TJ"
    ],
    "distractorFarCodes": [
      "TR",
      "SA",
      "EG",
      "ID",
      "MY",
      "JP",
      "CN",
      "TH",
      "VN",
      "BR"
    ]
  },
  {
    "id": "food_new_kimchi_kr",
    "answer": "KR",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Kimchi",
      "ar": "كيمتشي"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_kimchi_kr.jpg",
    "imageAlt": "Kimchi food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "TW",
        "label": {
          "en": "Taiwan",
          "ar": "تايوان"
        }
      },
      {
        "countryCode": "MN",
        "label": {
          "en": "Mongolia",
          "ar": "منغوليا"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "PH",
        "label": {
          "en": "Philippines",
          "ar": "الفلبين"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "ID",
        "label": {
          "en": "Indonesia",
          "ar": "إندونيسيا"
        }
      },
      {
        "countryCode": "MY",
        "label": {
          "en": "Malaysia",
          "ar": "ماليزيا"
        }
      },
      {
        "countryCode": "SG",
        "label": {
          "en": "Singapore",
          "ar": "سنغافورة"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      }
    ],
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "vegetables",
      "east_asia"
    ],
    "similarityGroup": "food_new_kimchi_kr",
    "distractorNearCodes": [
      "JP",
      "CN",
      "TW",
      "MN",
      "VN",
      "PH",
      "TH",
      "ID",
      "MY",
      "SG"
    ],
    "distractorFarCodes": [
      "EG",
      "IN",
      "TR",
      "GR",
      "IT",
      "MA",
      "FR",
      "ES",
      "GB",
      "US"
    ]
  },
  {
    "id": "food_new_fish_and_chips_gb",
    "answer": "GB",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Fish and Chips",
      "ar": "فيش آند تشيبس"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_fish_and_chips_gb.jpg",
    "imageAlt": "Fish and Chips food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "BE",
        "label": {
          "en": "Belgium",
          "ar": "بلجيكا"
        }
      },
      {
        "countryCode": "NL",
        "label": {
          "en": "Netherlands",
          "ar": "هولندا"
        }
      },
      {
        "countryCode": "CH",
        "label": {
          "en": "Switzerland",
          "ar": "سويسرا"
        }
      },
      {
        "countryCode": "IE",
        "label": {
          "en": "Ireland",
          "ar": "أيرلندا"
        }
      },
      {
        "countryCode": "LU",
        "label": {
          "en": "Luxembourg",
          "ar": "لوكسمبورغ"
        }
      },
      {
        "countryCode": "AT",
        "label": {
          "en": "Austria",
          "ar": "النمسا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "PT",
        "label": {
          "en": "Portugal",
          "ar": "البرتغال"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "PH",
        "label": {
          "en": "Philippines",
          "ar": "الفلبين"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      }
    ],
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "seafood",
      "western_europe"
    ],
    "similarityGroup": "food_new_fish_and_chips_gb",
    "distractorNearCodes": [
      "FR",
      "DE",
      "BE",
      "NL",
      "CH",
      "IE",
      "LU",
      "AT"
    ],
    "distractorFarCodes": [
      "JP",
      "GR",
      "IT",
      "ES",
      "TH",
      "EG",
      "PT",
      "KR",
      "PH",
      "VN"
    ]
  },
  {
    "id": "food_new_american_style_burger_us",
    "answer": "US",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Burger",
      "ar": "برجر"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_american_style_burger_us.jpg",
    "imageAlt": "American-style Burger food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "MX",
        "label": {
          "en": "Mexico",
          "ar": "المكسيك"
        }
      },
      {
        "countryCode": "GT",
        "label": {
          "en": "Guatemala",
          "ar": "غواتيمالا"
        }
      },
      {
        "countryCode": "HN",
        "label": {
          "en": "Honduras",
          "ar": "هندوراس"
        }
      },
      {
        "countryCode": "SV",
        "label": {
          "en": "El Salvador",
          "ar": "السلفادور"
        }
      },
      {
        "countryCode": "NI",
        "label": {
          "en": "Nicaragua",
          "ar": "نيكاراغوا"
        }
      },
      {
        "countryCode": "CR",
        "label": {
          "en": "Costa Rica",
          "ar": "كوستاريكا"
        }
      },
      {
        "countryCode": "PA",
        "label": {
          "en": "Panama",
          "ar": "بنما"
        }
      },
      {
        "countryCode": "CO",
        "label": {
          "en": "Colombia",
          "ar": "كولومبيا"
        }
      },
      {
        "countryCode": "CU",
        "label": {
          "en": "Cuba",
          "ar": "كوبا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "AR",
        "label": {
          "en": "Argentina",
          "ar": "الأرجنتين"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      }
    ],
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "sandwich",
      "latam_central"
    ],
    "similarityGroup": "food_new_american_style_burger_us",
    "distractorNearCodes": [
      "MX",
      "GT",
      "HN",
      "SV",
      "NI",
      "CR",
      "PA",
      "CO",
      "CU"
    ],
    "distractorFarCodes": [
      "TR",
      "DE",
      "EG",
      "GR",
      "GB",
      "IT",
      "AR",
      "FR",
      "ES",
      "IN"
    ]
  },
  {
    "id": "food_new_gulyas_hu",
    "answer": "HU",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Gulyás",
      "ar": "جولاش مجري"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_gulyas_hu.jpg",
    "imageAlt": "Gulyás food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "HU",
        "label": {
          "en": "Hungary",
          "ar": "هنغاريا"
        }
      },
      {
        "countryCode": "PL",
        "label": {
          "en": "Poland",
          "ar": "بولندا"
        }
      },
      {
        "countryCode": "UA",
        "label": {
          "en": "Ukraine",
          "ar": "أوكرانيا"
        }
      },
      {
        "countryCode": "RU",
        "label": {
          "en": "Russia",
          "ar": "روسيا"
        }
      },
      {
        "countryCode": "BY",
        "label": {
          "en": "Belarus",
          "ar": "بيلاروسيا"
        }
      },
      {
        "countryCode": "SK",
        "label": {
          "en": "Slovakia",
          "ar": "سلوفاكيا"
        }
      },
      {
        "countryCode": "CZ",
        "label": {
          "en": "Czechia",
          "ar": "التشيك"
        }
      },
      {
        "countryCode": "RO",
        "label": {
          "en": "Romania",
          "ar": "رومانيا"
        }
      },
      {
        "countryCode": "LT",
        "label": {
          "en": "Lithuania",
          "ar": "ليتوانيا"
        }
      },
      {
        "countryCode": "LV",
        "label": {
          "en": "Latvia",
          "ar": "لاتفيا"
        }
      },
      {
        "countryCode": "EE",
        "label": {
          "en": "Estonia",
          "ar": "إستونيا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "stew",
      "east_europe"
    ],
    "similarityGroup": "food_new_gulyas_hu",
    "distractorNearCodes": [
      "PL",
      "UA",
      "RU",
      "BY",
      "SK",
      "CZ",
      "RO",
      "LT",
      "LV",
      "EE"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA"
    ]
  },
  {
    "id": "food_new_mole_poblano_mx",
    "answer": "MX",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Mole Poblano",
      "ar": "مولي بوبلانو"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_mole_poblano_mx.jpg",
    "imageAlt": "Mole Poblano food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "MX",
        "label": {
          "en": "Mexico",
          "ar": "المكسيك"
        }
      },
      {
        "countryCode": "GT",
        "label": {
          "en": "Guatemala",
          "ar": "غواتيمالا"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "CO",
        "label": {
          "en": "Colombia",
          "ar": "كولومبيا"
        }
      },
      {
        "countryCode": "PE",
        "label": {
          "en": "Peru",
          "ar": "بيرو"
        }
      },
      {
        "countryCode": "CR",
        "label": {
          "en": "Costa Rica",
          "ar": "كوستاريكا"
        }
      },
      {
        "countryCode": "HN",
        "label": {
          "en": "Honduras",
          "ar": "هندوراس"
        }
      },
      {
        "countryCode": "SV",
        "label": {
          "en": "El Salvador",
          "ar": "السلفادور"
        }
      },
      {
        "countryCode": "NI",
        "label": {
          "en": "Nicaragua",
          "ar": "نيكاراغوا"
        }
      },
      {
        "countryCode": "PA",
        "label": {
          "en": "Panama",
          "ar": "بنما"
        }
      },
      {
        "countryCode": "CU",
        "label": {
          "en": "Cuba",
          "ar": "كوبا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "latam_central"
    ],
    "similarityGroup": "food_new_mole_poblano_mx",
    "distractorNearCodes": [
      "GT",
      "US",
      "CO",
      "PE",
      "CR",
      "HN",
      "SV",
      "NI",
      "PA",
      "CU"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA"
    ]
  },
  {
    "id": "food_new_pierogi_pl",
    "answer": "PL",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Pierogi",
      "ar": "بيروجي"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_pierogi_pl.jpg",
    "imageAlt": "Pierogi food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "PL",
        "label": {
          "en": "Poland",
          "ar": "بولندا"
        }
      },
      {
        "countryCode": "CZ",
        "label": {
          "en": "Czechia",
          "ar": "التشيك"
        }
      },
      {
        "countryCode": "SK",
        "label": {
          "en": "Slovakia",
          "ar": "سلوفاكيا"
        }
      },
      {
        "countryCode": "UA",
        "label": {
          "en": "Ukraine",
          "ar": "أوكرانيا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "LT",
        "label": {
          "en": "Lithuania",
          "ar": "ليتوانيا"
        }
      },
      {
        "countryCode": "RU",
        "label": {
          "en": "Russia",
          "ar": "روسيا"
        }
      },
      {
        "countryCode": "BY",
        "label": {
          "en": "Belarus",
          "ar": "بيلاروسيا"
        }
      },
      {
        "countryCode": "HU",
        "label": {
          "en": "Hungary",
          "ar": "هنغاريا"
        }
      },
      {
        "countryCode": "RO",
        "label": {
          "en": "Romania",
          "ar": "رومانيا"
        }
      },
      {
        "countryCode": "LV",
        "label": {
          "en": "Latvia",
          "ar": "لاتفيا"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "GE",
        "label": {
          "en": "Georgia",
          "ar": "جورجيا"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "dumplings",
      "east_europe"
    ],
    "similarityGroup": "food_new_pierogi_pl",
    "distractorNearCodes": [
      "CZ",
      "SK",
      "UA",
      "DE",
      "LT",
      "RU",
      "BY",
      "HU",
      "RO",
      "LV"
    ],
    "distractorFarCodes": [
      "CN",
      "JP",
      "TR",
      "IT",
      "GE",
      "KR",
      "IN",
      "EG",
      "FR",
      "ES"
    ]
  },
  {
    "id": "food_new_bacalhau_a_gomes_de_sa_pt",
    "answer": "PT",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Bacalhau à Gomes de Sá",
      "ar": "باكالاو جوميش دي سا"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_bacalhau_a_gomes_de_sa_pt.jpeg",
    "imageAlt": "Bacalhau à Gomes de Sá food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "PT",
        "label": {
          "en": "Portugal",
          "ar": "البرتغال"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "MT",
        "label": {
          "en": "Malta",
          "ar": "مالطا"
        }
      },
      {
        "countryCode": "CY",
        "label": {
          "en": "Cyprus",
          "ar": "قبرص"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "HR",
        "label": {
          "en": "Croatia",
          "ar": "كرواتيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "PH",
        "label": {
          "en": "Philippines",
          "ar": "الفلبين"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "seafood",
      "med_europe"
    ],
    "similarityGroup": "food_new_bacalhau_a_gomes_de_sa_pt",
    "distractorNearCodes": [
      "ES",
      "FR",
      "IT",
      "GR",
      "MA",
      "MT",
      "CY",
      "TR",
      "HR"
    ],
    "distractorFarCodes": [
      "JP",
      "TH",
      "EG",
      "KR",
      "GB",
      "PH",
      "VN",
      "US",
      "IN",
      "CN"
    ]
  },
  {
    "id": "food_new_tinola_ph",
    "answer": "PH",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Tinola",
      "ar": "تينولا"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_tinola_ph.jpeg",
    "imageAlt": "Tinola food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "PH",
        "label": {
          "en": "Philippines",
          "ar": "الفلبين"
        }
      },
      {
        "countryCode": "MY",
        "label": {
          "en": "Malaysia",
          "ar": "ماليزيا"
        }
      },
      {
        "countryCode": "ID",
        "label": {
          "en": "Indonesia",
          "ar": "إندونيسيا"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "SG",
        "label": {
          "en": "Singapore",
          "ar": "سنغافورة"
        }
      },
      {
        "countryCode": "KH",
        "label": {
          "en": "Cambodia",
          "ar": "كمبوديا"
        }
      },
      {
        "countryCode": "LA",
        "label": {
          "en": "Laos",
          "ar": "لاوس"
        }
      },
      {
        "countryCode": "MM",
        "label": {
          "en": "Myanmar (Burma)",
          "ar": "ميانمار (بورما)"
        }
      },
      {
        "countryCode": "BN",
        "label": {
          "en": "Brunei",
          "ar": "بروناي"
        }
      },
      {
        "countryCode": "TL",
        "label": {
          "en": "Timor-Leste",
          "ar": "تيمور الشرقية"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "RU",
        "label": {
          "en": "Russia",
          "ar": "روسيا"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "soup",
      "southeast_asia"
    ],
    "similarityGroup": "food_new_tinola_ph",
    "distractorNearCodes": [
      "MY",
      "ID",
      "TH",
      "VN",
      "SG",
      "KH",
      "LA",
      "MM",
      "BN",
      "TL"
    ],
    "distractorFarCodes": [
      "CN",
      "TR",
      "JP",
      "EG",
      "IN",
      "FR",
      "IT",
      "RU",
      "KR",
      "ES"
    ]
  },
  {
    "id": "food_new_ukrainian_borscht_ua",
    "answer": "UA",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Borscht",
      "ar": "بورش"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_ukrainian_borscht_ua.jpeg",
    "imageAlt": "Ukrainian Borscht food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "UA",
        "label": {
          "en": "Ukraine",
          "ar": "أوكرانيا"
        }
      },
      {
        "countryCode": "PL",
        "label": {
          "en": "Poland",
          "ar": "بولندا"
        }
      },
      {
        "countryCode": "RU",
        "label": {
          "en": "Russia",
          "ar": "روسيا"
        }
      },
      {
        "countryCode": "BY",
        "label": {
          "en": "Belarus",
          "ar": "بيلاروسيا"
        }
      },
      {
        "countryCode": "SK",
        "label": {
          "en": "Slovakia",
          "ar": "سلوفاكيا"
        }
      },
      {
        "countryCode": "CZ",
        "label": {
          "en": "Czechia",
          "ar": "التشيك"
        }
      },
      {
        "countryCode": "HU",
        "label": {
          "en": "Hungary",
          "ar": "هنغاريا"
        }
      },
      {
        "countryCode": "RO",
        "label": {
          "en": "Romania",
          "ar": "رومانيا"
        }
      },
      {
        "countryCode": "LT",
        "label": {
          "en": "Lithuania",
          "ar": "ليتوانيا"
        }
      },
      {
        "countryCode": "LV",
        "label": {
          "en": "Latvia",
          "ar": "لاتفيا"
        }
      },
      {
        "countryCode": "EE",
        "label": {
          "en": "Estonia",
          "ar": "إستونيا"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "soup",
      "east_europe"
    ],
    "similarityGroup": "food_new_ukrainian_borscht_ua",
    "distractorNearCodes": [
      "PL",
      "RU",
      "BY",
      "SK",
      "CZ",
      "HU",
      "RO",
      "LT",
      "LV",
      "EE"
    ],
    "distractorFarCodes": [
      "VN",
      "CN",
      "TR",
      "JP",
      "EG",
      "IN",
      "FR",
      "IT",
      "TH",
      "KR"
    ]
  },
  {
    "id": "food_new_dimlama_uz",
    "answer": "UZ",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Dimlama",
      "ar": "ديملاما"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_dimlama_uz.jpeg",
    "imageAlt": "Dimlama food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "UZ",
        "label": {
          "en": "Uzbekistan",
          "ar": "أوزبكستان"
        }
      },
      {
        "countryCode": "KG",
        "label": {
          "en": "Kyrgyzstan",
          "ar": "قيرغيزستان"
        }
      },
      {
        "countryCode": "TJ",
        "label": {
          "en": "Tajikistan",
          "ar": "طاجيكستان"
        }
      },
      {
        "countryCode": "TM",
        "label": {
          "en": "Turkmenistan",
          "ar": "تركمانستان"
        }
      },
      {
        "countryCode": "KZ",
        "label": {
          "en": "Kazakhstan",
          "ar": "كازاخستان"
        }
      },
      {
        "countryCode": "AF",
        "label": {
          "en": "Afghanistan",
          "ar": "أفغانستان"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "GE",
        "label": {
          "en": "Georgia",
          "ar": "جورجيا"
        }
      },
      {
        "countryCode": "AM",
        "label": {
          "en": "Armenia",
          "ar": "أرمينيا"
        }
      },
      {
        "countryCode": "AZ",
        "label": {
          "en": "Azerbaijan",
          "ar": "أذربيجان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "central_asia"
    ],
    "similarityGroup": "food_new_dimlama_uz",
    "distractorNearCodes": [
      "KG",
      "TJ",
      "TM",
      "KZ",
      "AF",
      "IR",
      "GE",
      "AM",
      "AZ",
      "TR"
    ],
    "distractorFarCodes": [
      "EG",
      "MA",
      "IN",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA",
      "IT",
      "BR"
    ]
  },
  {
    "id": "food_new_pani_puri_in",
    "answer": "IN",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Pani Puri",
      "ar": "باني بوري"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_pani_puri_in.jpg",
    "imageAlt": "Pani Puri food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "BD",
        "label": {
          "en": "Bangladesh",
          "ar": "بنغلاديش"
        }
      },
      {
        "countryCode": "NP",
        "label": {
          "en": "Nepal",
          "ar": "نيبال"
        }
      },
      {
        "countryCode": "LK",
        "label": {
          "en": "Sri Lanka",
          "ar": "سريلانكا"
        }
      },
      {
        "countryCode": "AF",
        "label": {
          "en": "Afghanistan",
          "ar": "أفغانستان"
        }
      },
      {
        "countryCode": "BT",
        "label": {
          "en": "Bhutan",
          "ar": "بوتان"
        }
      },
      {
        "countryCode": "MV",
        "label": {
          "en": "Maldives",
          "ar": "جزر المالديف"
        }
      },
      {
        "countryCode": "UZ",
        "label": {
          "en": "Uzbekistan",
          "ar": "أوزبكستان"
        }
      },
      {
        "countryCode": "KG",
        "label": {
          "en": "Kyrgyzstan",
          "ar": "قيرغيزستان"
        }
      },
      {
        "countryCode": "TJ",
        "label": {
          "en": "Tajikistan",
          "ar": "طاجيكستان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "MX",
        "label": {
          "en": "Mexico",
          "ar": "المكسيك"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "snack",
      "south_asia"
    ],
    "similarityGroup": "food_new_pani_puri_in",
    "distractorNearCodes": [
      "PK",
      "BD",
      "NP",
      "LK",
      "AF",
      "BT",
      "MV",
      "UZ",
      "KG",
      "TJ"
    ],
    "distractorFarCodes": [
      "TR",
      "MX",
      "TH",
      "EG",
      "FR",
      "IT",
      "JP",
      "BR",
      "CN",
      "ES"
    ]
  },
  {
    "id": "food_new_ackee_and_saltfish_jm",
    "answer": "JM",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Ackee and Saltfish",
      "ar": "آكي وسمك مملح"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_ackee_and_saltfish_jm.jpeg",
    "imageAlt": "Ackee and Saltfish food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "JM",
        "label": {
          "en": "Jamaica",
          "ar": "جامايكا"
        }
      },
      {
        "countryCode": "HT",
        "label": {
          "en": "Haiti",
          "ar": "هايتي"
        }
      },
      {
        "countryCode": "DO",
        "label": {
          "en": "Dominican Republic",
          "ar": "جمهورية الدومينيكان"
        }
      },
      {
        "countryCode": "CU",
        "label": {
          "en": "Cuba",
          "ar": "كوبا"
        }
      },
      {
        "countryCode": "BS",
        "label": {
          "en": "Bahamas",
          "ar": "جزر البهاما"
        }
      },
      {
        "countryCode": "BB",
        "label": {
          "en": "Barbados",
          "ar": "بربادوس"
        }
      },
      {
        "countryCode": "LC",
        "label": {
          "en": "St. Lucia",
          "ar": "سانت لوسيا"
        }
      },
      {
        "countryCode": "VC",
        "label": {
          "en": "St. Vincent & Grenadines",
          "ar": "سانت فنسنت وجزر غرينادين"
        }
      },
      {
        "countryCode": "GD",
        "label": {
          "en": "Grenada",
          "ar": "غرينادا"
        }
      },
      {
        "countryCode": "AG",
        "label": {
          "en": "Antigua & Barbuda",
          "ar": "أنتيغوا وبربودا"
        }
      },
      {
        "countryCode": "GY",
        "label": {
          "en": "Guyana",
          "ar": "غيانا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "PT",
        "label": {
          "en": "Portugal",
          "ar": "البرتغال"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "seafood",
      "caribbean"
    ],
    "similarityGroup": "food_new_ackee_and_saltfish_jm",
    "distractorNearCodes": [
      "HT",
      "DO",
      "CU",
      "BS",
      "BB",
      "LC",
      "VC",
      "GD",
      "AG",
      "GY"
    ],
    "distractorFarCodes": [
      "JP",
      "GR",
      "IT",
      "ES",
      "TH",
      "FR",
      "EG",
      "PT",
      "KR",
      "GB"
    ]
  },
  {
    "id": "food_new_hangi_nz",
    "answer": "NZ",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Hāngī",
      "ar": "هانجي"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_hangi_nz.jpg",
    "imageAlt": "Hāngī food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "NZ",
        "label": {
          "en": "New Zealand",
          "ar": "نيوزيلندا"
        }
      },
      {
        "countryCode": "AU",
        "label": {
          "en": "Australia",
          "ar": "أستراليا"
        }
      },
      {
        "countryCode": "FJ",
        "label": {
          "en": "Fiji",
          "ar": "فيجي"
        }
      },
      {
        "countryCode": "TO",
        "label": {
          "en": "Tonga",
          "ar": "تونغا"
        }
      },
      {
        "countryCode": "WS",
        "label": {
          "en": "Samoa",
          "ar": "ساموا"
        }
      },
      {
        "countryCode": "VU",
        "label": {
          "en": "Vanuatu",
          "ar": "فانواتو"
        }
      },
      {
        "countryCode": "PG",
        "label": {
          "en": "Papua New Guinea",
          "ar": "بابوا غينيا الجديدة"
        }
      },
      {
        "countryCode": "KI",
        "label": {
          "en": "Kiribati",
          "ar": "كيريباتي"
        }
      },
      {
        "countryCode": "MH",
        "label": {
          "en": "Marshall Islands",
          "ar": "جزر مارشال"
        }
      },
      {
        "countryCode": "FM",
        "label": {
          "en": "Micronesia",
          "ar": "ميكرونيزيا"
        }
      },
      {
        "countryCode": "SB",
        "label": {
          "en": "Solomon Islands",
          "ar": "جزر سليمان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "ZA",
        "label": {
          "en": "South Africa",
          "ar": "جنوب أفريقيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "meat",
      "oceania"
    ],
    "similarityGroup": "food_new_hangi_nz",
    "distractorNearCodes": [
      "AU",
      "FJ",
      "TO",
      "WS",
      "VU",
      "PG",
      "KI",
      "MH",
      "FM",
      "SB"
    ],
    "distractorFarCodes": [
      "TR",
      "DE",
      "GR",
      "EG",
      "SA",
      "BR",
      "US",
      "IN",
      "FR",
      "ZA"
    ]
  },
  {
    "id": "food_new_paella_es",
    "answer": "ES",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Paella",
      "ar": "باييا"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_paella_es.jpg",
    "imageAlt": "Paella food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "PT",
        "label": {
          "en": "Portugal",
          "ar": "البرتغال"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "MT",
        "label": {
          "en": "Malta",
          "ar": "مالطا"
        }
      },
      {
        "countryCode": "CY",
        "label": {
          "en": "Cyprus",
          "ar": "قبرص"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "HR",
        "label": {
          "en": "Croatia",
          "ar": "كرواتيا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "ID",
        "label": {
          "en": "Indonesia",
          "ar": "إندونيسيا"
        }
      },
      {
        "countryCode": "MY",
        "label": {
          "en": "Malaysia",
          "ar": "ماليزيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      }
    ],
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "rice",
      "med_europe"
    ],
    "similarityGroup": "food_new_paella_es",
    "distractorNearCodes": [
      "IT",
      "PT",
      "FR",
      "GR",
      "MT",
      "CY",
      "TR",
      "HR"
    ],
    "distractorFarCodes": [
      "IN",
      "PK",
      "SA",
      "EG",
      "ID",
      "MY",
      "JP",
      "CN",
      "TH",
      "VN"
    ]
  },
  {
    "id": "food_new_tajine_zitoune_dz",
    "answer": "DZ",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Tajine Zitoune",
      "ar": "طاجين زيتون"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_tajine_zitoune_dz.jpeg",
    "imageAlt": "Tajine Zitoune food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "DZ",
        "label": {
          "en": "Algeria",
          "ar": "الجزائر"
        }
      },
      {
        "countryCode": "TN",
        "label": {
          "en": "Tunisia",
          "ar": "تونس"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "LY",
        "label": {
          "en": "Libya",
          "ar": "ليبيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "SD",
        "label": {
          "en": "Sudan",
          "ar": "السودان"
        }
      },
      {
        "countryCode": "JO",
        "label": {
          "en": "Jordan",
          "ar": "الأردن"
        }
      },
      {
        "countryCode": "LB",
        "label": {
          "en": "Lebanon",
          "ar": "لبنان"
        }
      },
      {
        "countryCode": "SY",
        "label": {
          "en": "Syria",
          "ar": "سوريا"
        }
      },
      {
        "countryCode": "PS",
        "label": {
          "en": "Palestine",
          "ar": "فلسطين"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "stew",
      "north_africa"
    ],
    "similarityGroup": "food_new_tajine_zitoune_dz",
    "distractorNearCodes": [
      "TN",
      "MA",
      "LY",
      "EG",
      "FR",
      "SD",
      "JO",
      "LB",
      "SY",
      "PS"
    ],
    "distractorFarCodes": [
      "TR",
      "IN",
      "IR",
      "GR",
      "YE",
      "PK",
      "SA",
      "IT",
      "BR",
      "TH"
    ]
  },
  {
    "id": "food_new_ajdovi_zganci_with_pecenica_si",
    "answer": "SI",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Ajdovi Žganci",
      "ar": "عصيدة الحنطة بالسجق"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_ajdovi_zganci_with_pecenica_si.jpeg",
    "imageAlt": "Ajdovi Žganci with Pečenica food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "SI",
        "label": {
          "en": "Slovenia",
          "ar": "سلوفينيا"
        }
      },
      {
        "countryCode": "HR",
        "label": {
          "en": "Croatia",
          "ar": "كرواتيا"
        }
      },
      {
        "countryCode": "AT",
        "label": {
          "en": "Austria",
          "ar": "النمسا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "HU",
        "label": {
          "en": "Hungary",
          "ar": "هنغاريا"
        }
      },
      {
        "countryCode": "RS",
        "label": {
          "en": "Serbia",
          "ar": "صربيا"
        }
      },
      {
        "countryCode": "AL",
        "label": {
          "en": "Albania",
          "ar": "ألبانيا"
        }
      },
      {
        "countryCode": "MK",
        "label": {
          "en": "North Macedonia",
          "ar": "مقدونيا الشمالية"
        }
      },
      {
        "countryCode": "BA",
        "label": {
          "en": "Bosnia & Herzegovina",
          "ar": "البوسنة والهرسك"
        }
      },
      {
        "countryCode": "ME",
        "label": {
          "en": "Montenegro",
          "ar": "الجبل الأسود"
        }
      },
      {
        "countryCode": "BG",
        "label": {
          "en": "Bulgaria",
          "ar": "بلغاريا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "ZA",
        "label": {
          "en": "South Africa",
          "ar": "جنوب أفريقيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "meat",
      "balkans"
    ],
    "similarityGroup": "food_new_ajdovi_zganci_with_pecenica_si",
    "distractorNearCodes": [
      "HR",
      "AT",
      "IT",
      "HU",
      "RS",
      "AL",
      "MK",
      "BA",
      "ME",
      "BG"
    ],
    "distractorFarCodes": [
      "TR",
      "DE",
      "GR",
      "EG",
      "SA",
      "BR",
      "US",
      "IN",
      "FR",
      "ZA"
    ]
  },
  {
    "id": "food_new_colombian_ajiaco_co",
    "answer": "CO",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Ajiaco",
      "ar": "أخياكو"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_colombian_ajiaco_co.jpeg",
    "imageAlt": "Colombian Ajiaco food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "CO",
        "label": {
          "en": "Colombia",
          "ar": "كولومبيا"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "AR",
        "label": {
          "en": "Argentina",
          "ar": "الأرجنتين"
        }
      },
      {
        "countryCode": "UY",
        "label": {
          "en": "Uruguay",
          "ar": "أورغواي"
        }
      },
      {
        "countryCode": "PY",
        "label": {
          "en": "Paraguay",
          "ar": "باراغواي"
        }
      },
      {
        "countryCode": "BO",
        "label": {
          "en": "Bolivia",
          "ar": "بوليفيا"
        }
      },
      {
        "countryCode": "CL",
        "label": {
          "en": "Chile",
          "ar": "تشيلي"
        }
      },
      {
        "countryCode": "PE",
        "label": {
          "en": "Peru",
          "ar": "بيرو"
        }
      },
      {
        "countryCode": "EC",
        "label": {
          "en": "Ecuador",
          "ar": "الإكوادور"
        }
      },
      {
        "countryCode": "VE",
        "label": {
          "en": "Venezuela",
          "ar": "فنزويلا"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "RU",
        "label": {
          "en": "Russia",
          "ar": "روسيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "soup",
      "latam_south"
    ],
    "similarityGroup": "food_new_colombian_ajiaco_co",
    "distractorNearCodes": [
      "BR",
      "AR",
      "UY",
      "PY",
      "BO",
      "CL",
      "PE",
      "EC",
      "VE"
    ],
    "distractorFarCodes": [
      "VN",
      "CN",
      "TR",
      "JP",
      "EG",
      "IN",
      "FR",
      "IT",
      "TH",
      "RU"
    ]
  },
  {
    "id": "food_new_barbagiuan_mc",
    "answer": "MC",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Barbagiuan",
      "ar": "بارباجوان"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_barbagiuan_mc.jpeg",
    "imageAlt": "Barbagiuan food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "MC",
        "label": {
          "en": "Monaco",
          "ar": "موناكو"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "CH",
        "label": {
          "en": "Switzerland",
          "ar": "سويسرا"
        }
      },
      {
        "countryCode": "PT",
        "label": {
          "en": "Portugal",
          "ar": "البرتغال"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "MT",
        "label": {
          "en": "Malta",
          "ar": "مالطا"
        }
      },
      {
        "countryCode": "CY",
        "label": {
          "en": "Cyprus",
          "ar": "قبرص"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "HR",
        "label": {
          "en": "Croatia",
          "ar": "كرواتيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "DZ",
        "label": {
          "en": "Algeria",
          "ar": "الجزائر"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "MX",
        "label": {
          "en": "Mexico",
          "ar": "المكسيك"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "pastry",
      "med_europe"
    ],
    "similarityGroup": "food_new_barbagiuan_mc",
    "distractorNearCodes": [
      "FR",
      "IT",
      "ES",
      "CH",
      "PT",
      "GR",
      "MT",
      "CY",
      "TR",
      "HR"
    ],
    "distractorFarCodes": [
      "EG",
      "IN",
      "MA",
      "DZ",
      "GB",
      "US",
      "CN",
      "KR",
      "JP",
      "MX"
    ]
  },
  {
    "id": "food_new_batar_da_an_tl",
    "answer": "TL",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Batar Da'an",
      "ar": "باتار دا آن"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_batar_da_an_tl.jpeg",
    "imageAlt": "Batar Da'an food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "TL",
        "label": {
          "en": "Timor-Leste",
          "ar": "تيمور الشرقية"
        }
      },
      {
        "countryCode": "ID",
        "label": {
          "en": "Indonesia",
          "ar": "إندونيسيا"
        }
      },
      {
        "countryCode": "PH",
        "label": {
          "en": "Philippines",
          "ar": "الفلبين"
        }
      },
      {
        "countryCode": "MY",
        "label": {
          "en": "Malaysia",
          "ar": "ماليزيا"
        }
      },
      {
        "countryCode": "AU",
        "label": {
          "en": "Australia",
          "ar": "أستراليا"
        }
      },
      {
        "countryCode": "PG",
        "label": {
          "en": "Papua New Guinea",
          "ar": "بابوا غينيا الجديدة"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "SG",
        "label": {
          "en": "Singapore",
          "ar": "سنغافورة"
        }
      },
      {
        "countryCode": "KH",
        "label": {
          "en": "Cambodia",
          "ar": "كمبوديا"
        }
      },
      {
        "countryCode": "LA",
        "label": {
          "en": "Laos",
          "ar": "لاوس"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "southeast_asia"
    ],
    "similarityGroup": "food_new_batar_da_an_tl",
    "distractorNearCodes": [
      "ID",
      "PH",
      "MY",
      "AU",
      "PG",
      "TH",
      "VN",
      "SG",
      "KH",
      "LA"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA"
    ]
  },
  {
    "id": "food_new_beef_bourguignon_fr",
    "answer": "FR",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Beef Bourguignon",
      "ar": "بوف بورجينيون"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_beef_bourguignon_fr.jpeg",
    "imageAlt": "Beef Bourguignon food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "BE",
        "label": {
          "en": "Belgium",
          "ar": "بلجيكا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "CH",
        "label": {
          "en": "Switzerland",
          "ar": "سويسرا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "NL",
        "label": {
          "en": "Netherlands",
          "ar": "هولندا"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "IE",
        "label": {
          "en": "Ireland",
          "ar": "أيرلندا"
        }
      },
      {
        "countryCode": "LU",
        "label": {
          "en": "Luxembourg",
          "ar": "لوكسمبورغ"
        }
      },
      {
        "countryCode": "AT",
        "label": {
          "en": "Austria",
          "ar": "النمسا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "stew",
      "western_europe"
    ],
    "similarityGroup": "food_new_beef_bourguignon_fr",
    "distractorNearCodes": [
      "BE",
      "DE",
      "CH",
      "IT",
      "ES",
      "NL",
      "GB",
      "IE",
      "LU",
      "AT"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "GR",
      "YE",
      "PK",
      "SA",
      "BR"
    ]
  },
  {
    "id": "food_new_bigos_pl",
    "answer": "PL",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Bigos",
      "ar": "بيجوس"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_bigos_pl.jpeg",
    "imageAlt": "Bigos food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "PL",
        "label": {
          "en": "Poland",
          "ar": "بولندا"
        }
      },
      {
        "countryCode": "CZ",
        "label": {
          "en": "Czechia",
          "ar": "التشيك"
        }
      },
      {
        "countryCode": "SK",
        "label": {
          "en": "Slovakia",
          "ar": "سلوفاكيا"
        }
      },
      {
        "countryCode": "UA",
        "label": {
          "en": "Ukraine",
          "ar": "أوكرانيا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "LT",
        "label": {
          "en": "Lithuania",
          "ar": "ليتوانيا"
        }
      },
      {
        "countryCode": "RU",
        "label": {
          "en": "Russia",
          "ar": "روسيا"
        }
      },
      {
        "countryCode": "BY",
        "label": {
          "en": "Belarus",
          "ar": "بيلاروسيا"
        }
      },
      {
        "countryCode": "HU",
        "label": {
          "en": "Hungary",
          "ar": "هنغاريا"
        }
      },
      {
        "countryCode": "RO",
        "label": {
          "en": "Romania",
          "ar": "رومانيا"
        }
      },
      {
        "countryCode": "LV",
        "label": {
          "en": "Latvia",
          "ar": "لاتفيا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "east_europe"
    ],
    "similarityGroup": "food_new_bigos_pl",
    "distractorNearCodes": [
      "CZ",
      "SK",
      "UA",
      "DE",
      "LT",
      "RU",
      "BY",
      "HU",
      "RO",
      "LV"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA"
    ]
  },
  {
    "id": "food_new_bobotie_za",
    "answer": "ZA",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Bobotie",
      "ar": "بوبوتي"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_bobotie_za.jpeg",
    "imageAlt": "Bobotie food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "ZA",
        "label": {
          "en": "South Africa",
          "ar": "جنوب أفريقيا"
        }
      },
      {
        "countryCode": "BW",
        "label": {
          "en": "Botswana",
          "ar": "بوتسوانا"
        }
      },
      {
        "countryCode": "ZM",
        "label": {
          "en": "Zambia",
          "ar": "زامبيا"
        }
      },
      {
        "countryCode": "ZW",
        "label": {
          "en": "Zimbabwe",
          "ar": "زيمبابوي"
        }
      },
      {
        "countryCode": "MZ",
        "label": {
          "en": "Mozambique",
          "ar": "موزمبيق"
        }
      },
      {
        "countryCode": "NA",
        "label": {
          "en": "Namibia",
          "ar": "ناميبيا"
        }
      },
      {
        "countryCode": "LS",
        "label": {
          "en": "Lesotho",
          "ar": "ليسوتو"
        }
      },
      {
        "countryCode": "SZ",
        "label": {
          "en": "Eswatini",
          "ar": "إسواتيني"
        }
      },
      {
        "countryCode": "MW",
        "label": {
          "en": "Malawi",
          "ar": "ملاوي"
        }
      },
      {
        "countryCode": "AO",
        "label": {
          "en": "Angola",
          "ar": "أنغولا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "AR",
        "label": {
          "en": "Argentina",
          "ar": "الأرجنتين"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "meat",
      "southern_africa"
    ],
    "similarityGroup": "food_new_bobotie_za",
    "distractorNearCodes": [
      "BW",
      "ZM",
      "ZW",
      "MZ",
      "NA",
      "LS",
      "SZ",
      "MW",
      "AO"
    ],
    "distractorFarCodes": [
      "TR",
      "DE",
      "GR",
      "EG",
      "SA",
      "BR",
      "US",
      "IN",
      "FR",
      "AR"
    ]
  },
  {
    "id": "food_new_bryndzove_halusky_sk",
    "answer": "SK",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Bryndzové Halušky",
      "ar": "بريندزوفي هالوشكي"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_bryndzove_halusky_sk.jpeg",
    "imageAlt": "Bryndzové Halušky food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "SK",
        "label": {
          "en": "Slovakia",
          "ar": "سلوفاكيا"
        }
      },
      {
        "countryCode": "PL",
        "label": {
          "en": "Poland",
          "ar": "بولندا"
        }
      },
      {
        "countryCode": "UA",
        "label": {
          "en": "Ukraine",
          "ar": "أوكرانيا"
        }
      },
      {
        "countryCode": "RU",
        "label": {
          "en": "Russia",
          "ar": "روسيا"
        }
      },
      {
        "countryCode": "BY",
        "label": {
          "en": "Belarus",
          "ar": "بيلاروسيا"
        }
      },
      {
        "countryCode": "CZ",
        "label": {
          "en": "Czechia",
          "ar": "التشيك"
        }
      },
      {
        "countryCode": "HU",
        "label": {
          "en": "Hungary",
          "ar": "هنغاريا"
        }
      },
      {
        "countryCode": "RO",
        "label": {
          "en": "Romania",
          "ar": "رومانيا"
        }
      },
      {
        "countryCode": "LT",
        "label": {
          "en": "Lithuania",
          "ar": "ليتوانيا"
        }
      },
      {
        "countryCode": "LV",
        "label": {
          "en": "Latvia",
          "ar": "لاتفيا"
        }
      },
      {
        "countryCode": "EE",
        "label": {
          "en": "Estonia",
          "ar": "إستونيا"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "GE",
        "label": {
          "en": "Georgia",
          "ar": "جورجيا"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "dumplings",
      "east_europe"
    ],
    "similarityGroup": "food_new_bryndzove_halusky_sk",
    "distractorNearCodes": [
      "PL",
      "UA",
      "RU",
      "BY",
      "CZ",
      "HU",
      "RO",
      "LT",
      "LV",
      "EE"
    ],
    "distractorFarCodes": [
      "CN",
      "JP",
      "TR",
      "IT",
      "GE",
      "KR",
      "IN",
      "EG",
      "FR",
      "ES"
    ]
  },
  {
    "id": "food_new_cafriela_de_frango_gw",
    "answer": "GW",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Cafriela de Frango",
      "ar": "كافريلا دجاج"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_cafriela_de_frango_gw.jpeg",
    "imageAlt": "Cafriela de Frango food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "GW",
        "label": {
          "en": "Guinea-Bissau",
          "ar": "غينيا بيساو"
        }
      },
      {
        "countryCode": "SN",
        "label": {
          "en": "Senegal",
          "ar": "السنغال"
        }
      },
      {
        "countryCode": "GM",
        "label": {
          "en": "Gambia",
          "ar": "غامبيا"
        }
      },
      {
        "countryCode": "GN",
        "label": {
          "en": "Guinea",
          "ar": "غينيا"
        }
      },
      {
        "countryCode": "CI",
        "label": {
          "en": "Côte d’Ivoire",
          "ar": "ساحل العاج"
        }
      },
      {
        "countryCode": "GH",
        "label": {
          "en": "Ghana",
          "ar": "غانا"
        }
      },
      {
        "countryCode": "NG",
        "label": {
          "en": "Nigeria",
          "ar": "نيجيريا"
        }
      },
      {
        "countryCode": "TG",
        "label": {
          "en": "Togo",
          "ar": "توغو"
        }
      },
      {
        "countryCode": "BJ",
        "label": {
          "en": "Benin",
          "ar": "بنين"
        }
      },
      {
        "countryCode": "NE",
        "label": {
          "en": "Niger",
          "ar": "النيجر"
        }
      },
      {
        "countryCode": "ML",
        "label": {
          "en": "Mali",
          "ar": "مالي"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "west_africa"
    ],
    "similarityGroup": "food_new_cafriela_de_frango_gw",
    "distractorNearCodes": [
      "SN",
      "GM",
      "GN",
      "CI",
      "GH",
      "NG",
      "TG",
      "BJ",
      "NE",
      "ML"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA"
    ]
  },
  {
    "id": "food_new_calulu_de_peixe_st",
    "answer": "ST",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Calulu de Peixe",
      "ar": "كالولو سمك"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_calulu_de_peixe_st.jpeg",
    "imageAlt": "Calulu de Peixe food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "ST",
        "label": {
          "en": "São Tomé and Príncipe",
          "ar": "ساو تومي وبرينسيبي"
        }
      },
      {
        "countryCode": "CG",
        "label": {
          "en": "Republic of the Congo",
          "ar": "الكونغو"
        }
      },
      {
        "countryCode": "CM",
        "label": {
          "en": "Cameroon",
          "ar": "الكاميرون"
        }
      },
      {
        "countryCode": "AO",
        "label": {
          "en": "Angola",
          "ar": "أنغولا"
        }
      },
      {
        "countryCode": "CD",
        "label": {
          "en": "DR Congo",
          "ar": "الكونغو الديمقراطية"
        }
      },
      {
        "countryCode": "GQ",
        "label": {
          "en": "Equatorial Guinea",
          "ar": "غينيا الاستوائية"
        }
      },
      {
        "countryCode": "GA",
        "label": {
          "en": "Gabon",
          "ar": "الغابون"
        }
      },
      {
        "countryCode": "CF",
        "label": {
          "en": "Central African Republic",
          "ar": "جمهورية أفريقيا الوسطى"
        }
      },
      {
        "countryCode": "TD",
        "label": {
          "en": "Chad",
          "ar": "تشاد"
        }
      },
      {
        "countryCode": "ZM",
        "label": {
          "en": "Zambia",
          "ar": "زامبيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "PT",
        "label": {
          "en": "Portugal",
          "ar": "البرتغال"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "seafood",
      "central_africa"
    ],
    "similarityGroup": "food_new_calulu_de_peixe_st",
    "distractorNearCodes": [
      "CG",
      "CM",
      "AO",
      "CD",
      "GQ",
      "GA",
      "CF",
      "TD",
      "ZM"
    ],
    "distractorFarCodes": [
      "JP",
      "GR",
      "IT",
      "ES",
      "TH",
      "FR",
      "EG",
      "PT",
      "KR",
      "GB"
    ]
  },
  {
    "id": "food_new_chicken_sekuwa_np",
    "answer": "NP",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Chicken Sekuwa",
      "ar": "سيكوا دجاج"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_chicken_sekuwa_np.jpeg",
    "imageAlt": "Chicken Sekuwa food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "NP",
        "label": {
          "en": "Nepal",
          "ar": "نيبال"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "BT",
        "label": {
          "en": "Bhutan",
          "ar": "بوتان"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "BD",
        "label": {
          "en": "Bangladesh",
          "ar": "بنغلاديش"
        }
      },
      {
        "countryCode": "LK",
        "label": {
          "en": "Sri Lanka",
          "ar": "سريلانكا"
        }
      },
      {
        "countryCode": "AF",
        "label": {
          "en": "Afghanistan",
          "ar": "أفغانستان"
        }
      },
      {
        "countryCode": "MV",
        "label": {
          "en": "Maldives",
          "ar": "جزر المالديف"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "ZA",
        "label": {
          "en": "South Africa",
          "ar": "جنوب أفريقيا"
        }
      },
      {
        "countryCode": "AR",
        "label": {
          "en": "Argentina",
          "ar": "الأرجنتين"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "meat",
      "south_asia"
    ],
    "similarityGroup": "food_new_chicken_sekuwa_np",
    "distractorNearCodes": [
      "IN",
      "BT",
      "PK",
      "CN",
      "BD",
      "LK",
      "AF",
      "MV"
    ],
    "distractorFarCodes": [
      "TR",
      "DE",
      "GR",
      "EG",
      "SA",
      "BR",
      "US",
      "FR",
      "ZA",
      "AR"
    ]
  },
  {
    "id": "food_new_dejaj_salona_ae",
    "answer": "AE",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Dejaj Salona",
      "ar": "صالونة دجاج"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_dejaj_salona_ae.jpeg",
    "imageAlt": "Dejaj Salona food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "AE",
        "label": {
          "en": "United Arab Emirates",
          "ar": "الإمارات"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "OM",
        "label": {
          "en": "Oman",
          "ar": "عُمان"
        }
      },
      {
        "countryCode": "QA",
        "label": {
          "en": "Qatar",
          "ar": "قطر"
        }
      },
      {
        "countryCode": "KW",
        "label": {
          "en": "Kuwait",
          "ar": "الكويت"
        }
      },
      {
        "countryCode": "BH",
        "label": {
          "en": "Bahrain",
          "ar": "البحرين"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "IQ",
        "label": {
          "en": "Iraq",
          "ar": "العراق"
        }
      },
      {
        "countryCode": "JO",
        "label": {
          "en": "Jordan",
          "ar": "الأردن"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "stew",
      "gulf"
    ],
    "similarityGroup": "food_new_dejaj_salona_ae",
    "distractorNearCodes": [
      "SA",
      "OM",
      "QA",
      "KW",
      "BH",
      "YE",
      "IQ",
      "JO"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "PK",
      "IT",
      "BR"
    ]
  },
  {
    "id": "food_new_digaag_duban_so",
    "answer": "SO",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Digaag Duban",
      "ar": "دجاج دوبان"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_digaag_duban_so.jpeg",
    "imageAlt": "Digaag Duban food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "SO",
        "label": {
          "en": "Somalia",
          "ar": "الصومال"
        }
      },
      {
        "countryCode": "KE",
        "label": {
          "en": "Kenya",
          "ar": "كينيا"
        }
      },
      {
        "countryCode": "TZ",
        "label": {
          "en": "Tanzania",
          "ar": "تنزانيا"
        }
      },
      {
        "countryCode": "UG",
        "label": {
          "en": "Uganda",
          "ar": "أوغندا"
        }
      },
      {
        "countryCode": "RW",
        "label": {
          "en": "Rwanda",
          "ar": "رواندا"
        }
      },
      {
        "countryCode": "BI",
        "label": {
          "en": "Burundi",
          "ar": "بوروندي"
        }
      },
      {
        "countryCode": "DJ",
        "label": {
          "en": "Djibouti",
          "ar": "جيبوتي"
        }
      },
      {
        "countryCode": "ET",
        "label": {
          "en": "Ethiopia",
          "ar": "إثيوبيا"
        }
      },
      {
        "countryCode": "ER",
        "label": {
          "en": "Eritrea",
          "ar": "إريتريا"
        }
      },
      {
        "countryCode": "SD",
        "label": {
          "en": "Sudan",
          "ar": "السودان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "ZA",
        "label": {
          "en": "South Africa",
          "ar": "جنوب أفريقيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "meat",
      "east_africa"
    ],
    "similarityGroup": "food_new_digaag_duban_so",
    "distractorNearCodes": [
      "KE",
      "TZ",
      "UG",
      "RW",
      "BI",
      "DJ",
      "ET",
      "ER",
      "SD"
    ],
    "distractorFarCodes": [
      "TR",
      "DE",
      "GR",
      "EG",
      "SA",
      "BR",
      "US",
      "IN",
      "FR",
      "ZA"
    ]
  },
  {
    "id": "food_new_dounguouri_soko_ne",
    "answer": "NE",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Dounguouri Soko",
      "ar": "دونجوري سوكو"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_dounguouri_soko_ne.jpeg",
    "imageAlt": "Dounguouri Soko food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "NE",
        "label": {
          "en": "Niger",
          "ar": "النيجر"
        }
      },
      {
        "countryCode": "NG",
        "label": {
          "en": "Nigeria",
          "ar": "نيجيريا"
        }
      },
      {
        "countryCode": "GH",
        "label": {
          "en": "Ghana",
          "ar": "غانا"
        }
      },
      {
        "countryCode": "SN",
        "label": {
          "en": "Senegal",
          "ar": "السنغال"
        }
      },
      {
        "countryCode": "GM",
        "label": {
          "en": "Gambia",
          "ar": "غامبيا"
        }
      },
      {
        "countryCode": "CI",
        "label": {
          "en": "Côte d’Ivoire",
          "ar": "ساحل العاج"
        }
      },
      {
        "countryCode": "TG",
        "label": {
          "en": "Togo",
          "ar": "توغو"
        }
      },
      {
        "countryCode": "BJ",
        "label": {
          "en": "Benin",
          "ar": "بنين"
        }
      },
      {
        "countryCode": "GN",
        "label": {
          "en": "Guinea",
          "ar": "غينيا"
        }
      },
      {
        "countryCode": "GW",
        "label": {
          "en": "Guinea-Bissau",
          "ar": "غينيا بيساو"
        }
      },
      {
        "countryCode": "ML",
        "label": {
          "en": "Mali",
          "ar": "مالي"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "west_africa"
    ],
    "similarityGroup": "food_new_dounguouri_soko_ne",
    "distractorNearCodes": [
      "NG",
      "GH",
      "SN",
      "GM",
      "CI",
      "TG",
      "BJ",
      "GN",
      "GW",
      "ML"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA"
    ]
  },
  {
    "id": "food_new_ema_datshi_bt",
    "answer": "BT",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Ema Datshi",
      "ar": "إيما داتشي"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_ema_datshi_bt.jpeg",
    "imageAlt": "Ema Datshi food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "BT",
        "label": {
          "en": "Bhutan",
          "ar": "بوتان"
        }
      },
      {
        "countryCode": "NP",
        "label": {
          "en": "Nepal",
          "ar": "نيبال"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "BD",
        "label": {
          "en": "Bangladesh",
          "ar": "بنغلاديش"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "LK",
        "label": {
          "en": "Sri Lanka",
          "ar": "سريلانكا"
        }
      },
      {
        "countryCode": "AF",
        "label": {
          "en": "Afghanistan",
          "ar": "أفغانستان"
        }
      },
      {
        "countryCode": "MV",
        "label": {
          "en": "Maldives",
          "ar": "جزر المالديف"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "south_asia"
    ],
    "similarityGroup": "food_new_ema_datshi_bt",
    "distractorNearCodes": [
      "NP",
      "IN",
      "BD",
      "CN",
      "PK",
      "LK",
      "AF",
      "MV"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IR",
      "FR",
      "GR",
      "YE",
      "SA",
      "IT",
      "BR"
    ]
  },
  {
    "id": "food_new_fritada_de_chancho_ec",
    "answer": "EC",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Fritada de Chancho",
      "ar": "فريتادا"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_fritada_de_chancho_ec.jpeg",
    "imageAlt": "Fritada de Chancho food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "EC",
        "label": {
          "en": "Ecuador",
          "ar": "الإكوادور"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "AR",
        "label": {
          "en": "Argentina",
          "ar": "الأرجنتين"
        }
      },
      {
        "countryCode": "UY",
        "label": {
          "en": "Uruguay",
          "ar": "أورغواي"
        }
      },
      {
        "countryCode": "PY",
        "label": {
          "en": "Paraguay",
          "ar": "باراغواي"
        }
      },
      {
        "countryCode": "BO",
        "label": {
          "en": "Bolivia",
          "ar": "بوليفيا"
        }
      },
      {
        "countryCode": "CL",
        "label": {
          "en": "Chile",
          "ar": "تشيلي"
        }
      },
      {
        "countryCode": "PE",
        "label": {
          "en": "Peru",
          "ar": "بيرو"
        }
      },
      {
        "countryCode": "CO",
        "label": {
          "en": "Colombia",
          "ar": "كولومبيا"
        }
      },
      {
        "countryCode": "VE",
        "label": {
          "en": "Venezuela",
          "ar": "فنزويلا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "ZA",
        "label": {
          "en": "South Africa",
          "ar": "جنوب أفريقيا"
        }
      },
      {
        "countryCode": "MX",
        "label": {
          "en": "Mexico",
          "ar": "المكسيك"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "meat",
      "latam_south"
    ],
    "similarityGroup": "food_new_fritada_de_chancho_ec",
    "distractorNearCodes": [
      "BR",
      "AR",
      "UY",
      "PY",
      "BO",
      "CL",
      "PE",
      "CO",
      "VE"
    ],
    "distractorFarCodes": [
      "TR",
      "DE",
      "GR",
      "EG",
      "SA",
      "US",
      "IN",
      "FR",
      "ZA",
      "MX"
    ]
  },
  {
    "id": "food_new_fungee_and_pepperpot_ag",
    "answer": "AG",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Fungee and Pepperpot",
      "ar": "فونجي وببر بوت"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_fungee_and_pepperpot_ag.jpeg",
    "imageAlt": "Fungee and Pepperpot food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "AG",
        "label": {
          "en": "Antigua & Barbuda",
          "ar": "أنتيغوا وبربودا"
        }
      },
      {
        "countryCode": "BB",
        "label": {
          "en": "Barbados",
          "ar": "بربادوس"
        }
      },
      {
        "countryCode": "LC",
        "label": {
          "en": "St. Lucia",
          "ar": "سانت لوسيا"
        }
      },
      {
        "countryCode": "VC",
        "label": {
          "en": "St. Vincent & Grenadines",
          "ar": "سانت فنسنت وجزر غرينادين"
        }
      },
      {
        "countryCode": "GD",
        "label": {
          "en": "Grenada",
          "ar": "غرينادا"
        }
      },
      {
        "countryCode": "JM",
        "label": {
          "en": "Jamaica",
          "ar": "جامايكا"
        }
      },
      {
        "countryCode": "HT",
        "label": {
          "en": "Haiti",
          "ar": "هايتي"
        }
      },
      {
        "countryCode": "DO",
        "label": {
          "en": "Dominican Republic",
          "ar": "جمهورية الدومينيكان"
        }
      },
      {
        "countryCode": "CU",
        "label": {
          "en": "Cuba",
          "ar": "كوبا"
        }
      },
      {
        "countryCode": "BS",
        "label": {
          "en": "Bahamas",
          "ar": "جزر البهاما"
        }
      },
      {
        "countryCode": "GY",
        "label": {
          "en": "Guyana",
          "ar": "غيانا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "caribbean"
    ],
    "similarityGroup": "food_new_fungee_and_pepperpot_ag",
    "distractorNearCodes": [
      "BB",
      "LC",
      "VC",
      "GD",
      "JM",
      "HT",
      "DO",
      "CU",
      "BS",
      "GY"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA"
    ]
  },
  {
    "id": "food_new_farikal_no",
    "answer": "NO",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Fårikål",
      "ar": "فوريكول"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_farikal_no.jpeg",
    "imageAlt": "Fårikål food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "NO",
        "label": {
          "en": "Norway",
          "ar": "النرويج"
        }
      },
      {
        "countryCode": "DK",
        "label": {
          "en": "Denmark",
          "ar": "الدانمرك"
        }
      },
      {
        "countryCode": "SE",
        "label": {
          "en": "Sweden",
          "ar": "السويد"
        }
      },
      {
        "countryCode": "FI",
        "label": {
          "en": "Finland",
          "ar": "فنلندا"
        }
      },
      {
        "countryCode": "IS",
        "label": {
          "en": "Iceland",
          "ar": "آيسلندا"
        }
      },
      {
        "countryCode": "NL",
        "label": {
          "en": "Netherlands",
          "ar": "هولندا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "BE",
        "label": {
          "en": "Belgium",
          "ar": "بلجيكا"
        }
      },
      {
        "countryCode": "CH",
        "label": {
          "en": "Switzerland",
          "ar": "سويسرا"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "nordic"
    ],
    "similarityGroup": "food_new_farikal_no",
    "distractorNearCodes": [
      "DK",
      "SE",
      "FI",
      "IS",
      "NL",
      "DE",
      "FR",
      "BE",
      "CH",
      "GB"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "GR",
      "YE",
      "PK",
      "SA",
      "IT"
    ]
  },
  {
    "id": "food_new_gboma_dessi_tg",
    "answer": "TG",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Gboma Dessi",
      "ar": "جبوما ديسي"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_gboma_dessi_tg.jpeg",
    "imageAlt": "Gboma Dessi food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "TG",
        "label": {
          "en": "Togo",
          "ar": "توغو"
        }
      },
      {
        "countryCode": "NG",
        "label": {
          "en": "Nigeria",
          "ar": "نيجيريا"
        }
      },
      {
        "countryCode": "GH",
        "label": {
          "en": "Ghana",
          "ar": "غانا"
        }
      },
      {
        "countryCode": "SN",
        "label": {
          "en": "Senegal",
          "ar": "السنغال"
        }
      },
      {
        "countryCode": "GM",
        "label": {
          "en": "Gambia",
          "ar": "غامبيا"
        }
      },
      {
        "countryCode": "CI",
        "label": {
          "en": "Côte d’Ivoire",
          "ar": "ساحل العاج"
        }
      },
      {
        "countryCode": "BJ",
        "label": {
          "en": "Benin",
          "ar": "بنين"
        }
      },
      {
        "countryCode": "GN",
        "label": {
          "en": "Guinea",
          "ar": "غينيا"
        }
      },
      {
        "countryCode": "GW",
        "label": {
          "en": "Guinea-Bissau",
          "ar": "غينيا بيساو"
        }
      },
      {
        "countryCode": "NE",
        "label": {
          "en": "Niger",
          "ar": "النيجر"
        }
      },
      {
        "countryCode": "ML",
        "label": {
          "en": "Mali",
          "ar": "مالي"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "west_africa"
    ],
    "similarityGroup": "food_new_gboma_dessi_tg",
    "distractorNearCodes": [
      "NG",
      "GH",
      "SN",
      "GM",
      "CI",
      "BJ",
      "GN",
      "GW",
      "NE",
      "ML"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA"
    ]
  },
  {
    "id": "food_new_gers_ogaily_kw",
    "answer": "KW",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Gers Ogaily",
      "ar": "قرص عقيلي"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_gers_ogaily_kw.jpeg",
    "imageAlt": "Gers Ogaily food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "KW",
        "label": {
          "en": "Kuwait",
          "ar": "الكويت"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "IQ",
        "label": {
          "en": "Iraq",
          "ar": "العراق"
        }
      },
      {
        "countryCode": "AE",
        "label": {
          "en": "United Arab Emirates",
          "ar": "الإمارات"
        }
      },
      {
        "countryCode": "QA",
        "label": {
          "en": "Qatar",
          "ar": "قطر"
        }
      },
      {
        "countryCode": "BH",
        "label": {
          "en": "Bahrain",
          "ar": "البحرين"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "OM",
        "label": {
          "en": "Oman",
          "ar": "عُمان"
        }
      },
      {
        "countryCode": "JO",
        "label": {
          "en": "Jordan",
          "ar": "الأردن"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "BE",
        "label": {
          "en": "Belgium",
          "ar": "بلجيكا"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "dessert",
      "gulf"
    ],
    "similarityGroup": "food_new_gers_ogaily_kw",
    "distractorNearCodes": [
      "SA",
      "IQ",
      "AE",
      "QA",
      "BH",
      "YE",
      "OM",
      "JO"
    ],
    "distractorFarCodes": [
      "FR",
      "IT",
      "TR",
      "EG",
      "BE",
      "US",
      "GR",
      "IN",
      "BR",
      "ES"
    ]
  },
  {
    "id": "food_new_green_fig_and_saltfish_lc",
    "answer": "LC",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Green Fig and Saltfish",
      "ar": "موز أخضر وسمك مملح"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_green_fig_and_saltfish_lc.jpeg",
    "imageAlt": "Green Fig and Saltfish food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "LC",
        "label": {
          "en": "St. Lucia",
          "ar": "سانت لوسيا"
        }
      },
      {
        "countryCode": "VC",
        "label": {
          "en": "St. Vincent & Grenadines",
          "ar": "سانت فنسنت وجزر غرينادين"
        }
      },
      {
        "countryCode": "GD",
        "label": {
          "en": "Grenada",
          "ar": "غرينادا"
        }
      },
      {
        "countryCode": "BB",
        "label": {
          "en": "Barbados",
          "ar": "بربادوس"
        }
      },
      {
        "countryCode": "AG",
        "label": {
          "en": "Antigua & Barbuda",
          "ar": "أنتيغوا وبربودا"
        }
      },
      {
        "countryCode": "JM",
        "label": {
          "en": "Jamaica",
          "ar": "جامايكا"
        }
      },
      {
        "countryCode": "HT",
        "label": {
          "en": "Haiti",
          "ar": "هايتي"
        }
      },
      {
        "countryCode": "DO",
        "label": {
          "en": "Dominican Republic",
          "ar": "جمهورية الدومينيكان"
        }
      },
      {
        "countryCode": "CU",
        "label": {
          "en": "Cuba",
          "ar": "كوبا"
        }
      },
      {
        "countryCode": "BS",
        "label": {
          "en": "Bahamas",
          "ar": "جزر البهاما"
        }
      },
      {
        "countryCode": "GY",
        "label": {
          "en": "Guyana",
          "ar": "غيانا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "PT",
        "label": {
          "en": "Portugal",
          "ar": "البرتغال"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "seafood",
      "caribbean"
    ],
    "similarityGroup": "food_new_green_fig_and_saltfish_lc",
    "distractorNearCodes": [
      "VC",
      "GD",
      "BB",
      "AG",
      "JM",
      "HT",
      "DO",
      "CU",
      "BS",
      "GY"
    ],
    "distractorFarCodes": [
      "JP",
      "GR",
      "IT",
      "ES",
      "TH",
      "FR",
      "EG",
      "PT",
      "KR",
      "GB"
    ]
  },
  {
    "id": "food_new_haitian_griot_ht",
    "answer": "HT",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Griot",
      "ar": "جريو"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_haitian_griot_ht.jpeg",
    "imageAlt": "Haitian Griot food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "HT",
        "label": {
          "en": "Haiti",
          "ar": "هايتي"
        }
      },
      {
        "countryCode": "DO",
        "label": {
          "en": "Dominican Republic",
          "ar": "جمهورية الدومينيكان"
        }
      },
      {
        "countryCode": "JM",
        "label": {
          "en": "Jamaica",
          "ar": "جامايكا"
        }
      },
      {
        "countryCode": "CU",
        "label": {
          "en": "Cuba",
          "ar": "كوبا"
        }
      },
      {
        "countryCode": "BS",
        "label": {
          "en": "Bahamas",
          "ar": "جزر البهاما"
        }
      },
      {
        "countryCode": "TT",
        "label": {
          "en": "Trinidad & Tobago",
          "ar": "ترينيداد وتوباغو"
        }
      },
      {
        "countryCode": "BB",
        "label": {
          "en": "Barbados",
          "ar": "بربادوس"
        }
      },
      {
        "countryCode": "LC",
        "label": {
          "en": "St. Lucia",
          "ar": "سانت لوسيا"
        }
      },
      {
        "countryCode": "VC",
        "label": {
          "en": "St. Vincent & Grenadines",
          "ar": "سانت فنسنت وجزر غرينادين"
        }
      },
      {
        "countryCode": "GD",
        "label": {
          "en": "Grenada",
          "ar": "غرينادا"
        }
      },
      {
        "countryCode": "AG",
        "label": {
          "en": "Antigua & Barbuda",
          "ar": "أنتيغوا وبربودا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "ZA",
        "label": {
          "en": "South Africa",
          "ar": "جنوب أفريقيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "meat",
      "caribbean"
    ],
    "similarityGroup": "food_new_haitian_griot_ht",
    "distractorNearCodes": [
      "DO",
      "JM",
      "CU",
      "BS",
      "TT",
      "BB",
      "LC",
      "VC",
      "GD",
      "AG"
    ],
    "distractorFarCodes": [
      "TR",
      "DE",
      "GR",
      "EG",
      "SA",
      "BR",
      "US",
      "IN",
      "FR",
      "ZA"
    ]
  },
  {
    "id": "food_new_imqarrun_il_forn_mt",
    "answer": "MT",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Imqarrun il-Forn",
      "ar": "مكرونة بالفرن"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_imqarrun_il_forn_mt.jpeg",
    "imageAlt": "Imqarrun il-Forn food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "MT",
        "label": {
          "en": "Malta",
          "ar": "مالطا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "PT",
        "label": {
          "en": "Portugal",
          "ar": "البرتغال"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "CY",
        "label": {
          "en": "Cyprus",
          "ar": "قبرص"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "HR",
        "label": {
          "en": "Croatia",
          "ar": "كرواتيا"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "MX",
        "label": {
          "en": "Mexico",
          "ar": "المكسيك"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "pasta",
      "med_europe"
    ],
    "similarityGroup": "food_new_imqarrun_il_forn_mt",
    "distractorNearCodes": [
      "IT",
      "ES",
      "PT",
      "FR",
      "GR",
      "CY",
      "TR",
      "HR"
    ],
    "distractorFarCodes": [
      "US",
      "CN",
      "JP",
      "DE",
      "GB",
      "EG",
      "IN",
      "KR",
      "MX",
      "BR"
    ]
  },
  {
    "id": "food_new_kabuli_palaw_af",
    "answer": "AF",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Kabuli Palaw",
      "ar": "كابولي بلاو"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_kabuli_palaw_af.jpeg",
    "imageAlt": "Kabuli Palaw food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "AF",
        "label": {
          "en": "Afghanistan",
          "ar": "أفغانستان"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "UZ",
        "label": {
          "en": "Uzbekistan",
          "ar": "أوزبكستان"
        }
      },
      {
        "countryCode": "TJ",
        "label": {
          "en": "Tajikistan",
          "ar": "طاجيكستان"
        }
      },
      {
        "countryCode": "BD",
        "label": {
          "en": "Bangladesh",
          "ar": "بنغلاديش"
        }
      },
      {
        "countryCode": "LK",
        "label": {
          "en": "Sri Lanka",
          "ar": "سريلانكا"
        }
      },
      {
        "countryCode": "NP",
        "label": {
          "en": "Nepal",
          "ar": "نيبال"
        }
      },
      {
        "countryCode": "BT",
        "label": {
          "en": "Bhutan",
          "ar": "بوتان"
        }
      },
      {
        "countryCode": "MV",
        "label": {
          "en": "Maldives",
          "ar": "جزر المالديف"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "ID",
        "label": {
          "en": "Indonesia",
          "ar": "إندونيسيا"
        }
      },
      {
        "countryCode": "MY",
        "label": {
          "en": "Malaysia",
          "ar": "ماليزيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "rice",
      "south_asia"
    ],
    "similarityGroup": "food_new_kabuli_palaw_af",
    "distractorNearCodes": [
      "PK",
      "IR",
      "IN",
      "UZ",
      "TJ",
      "BD",
      "LK",
      "NP",
      "BT",
      "MV"
    ],
    "distractorFarCodes": [
      "TR",
      "SA",
      "EG",
      "ID",
      "MY",
      "JP",
      "CN",
      "TH",
      "VN",
      "BR"
    ]
  },
  {
    "id": "food_new_kapisi_pulu_to",
    "answer": "TO",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Kapisi Pulu",
      "ar": "كابيسي بولو"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_kapisi_pulu_to.jpeg",
    "imageAlt": "Kapisi Pulu food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "TO",
        "label": {
          "en": "Tonga",
          "ar": "تونغا"
        }
      },
      {
        "countryCode": "WS",
        "label": {
          "en": "Samoa",
          "ar": "ساموا"
        }
      },
      {
        "countryCode": "FJ",
        "label": {
          "en": "Fiji",
          "ar": "فيجي"
        }
      },
      {
        "countryCode": "VU",
        "label": {
          "en": "Vanuatu",
          "ar": "فانواتو"
        }
      },
      {
        "countryCode": "NZ",
        "label": {
          "en": "New Zealand",
          "ar": "نيوزيلندا"
        }
      },
      {
        "countryCode": "AU",
        "label": {
          "en": "Australia",
          "ar": "أستراليا"
        }
      },
      {
        "countryCode": "PG",
        "label": {
          "en": "Papua New Guinea",
          "ar": "بابوا غينيا الجديدة"
        }
      },
      {
        "countryCode": "KI",
        "label": {
          "en": "Kiribati",
          "ar": "كيريباتي"
        }
      },
      {
        "countryCode": "MH",
        "label": {
          "en": "Marshall Islands",
          "ar": "جزر مارشال"
        }
      },
      {
        "countryCode": "FM",
        "label": {
          "en": "Micronesia",
          "ar": "ميكرونيزيا"
        }
      },
      {
        "countryCode": "SB",
        "label": {
          "en": "Solomon Islands",
          "ar": "جزر سليمان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "ZA",
        "label": {
          "en": "South Africa",
          "ar": "جنوب أفريقيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "meat",
      "oceania"
    ],
    "similarityGroup": "food_new_kapisi_pulu_to",
    "distractorNearCodes": [
      "WS",
      "FJ",
      "VU",
      "NZ",
      "AU",
      "PG",
      "KI",
      "MH",
      "FM",
      "SB"
    ],
    "distractorFarCodes": [
      "TR",
      "DE",
      "GR",
      "EG",
      "SA",
      "BR",
      "US",
      "IN",
      "FR",
      "ZA"
    ]
  },
  {
    "id": "food_new_kedjenou_ci",
    "answer": "CI",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Kedjenou",
      "ar": "كيدجينو"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_kedjenou_ci.jpeg",
    "imageAlt": "Kedjenou food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "CI",
        "label": {
          "en": "Côte d’Ivoire",
          "ar": "ساحل العاج"
        }
      },
      {
        "countryCode": "NG",
        "label": {
          "en": "Nigeria",
          "ar": "نيجيريا"
        }
      },
      {
        "countryCode": "GH",
        "label": {
          "en": "Ghana",
          "ar": "غانا"
        }
      },
      {
        "countryCode": "SN",
        "label": {
          "en": "Senegal",
          "ar": "السنغال"
        }
      },
      {
        "countryCode": "GM",
        "label": {
          "en": "Gambia",
          "ar": "غامبيا"
        }
      },
      {
        "countryCode": "TG",
        "label": {
          "en": "Togo",
          "ar": "توغو"
        }
      },
      {
        "countryCode": "BJ",
        "label": {
          "en": "Benin",
          "ar": "بنين"
        }
      },
      {
        "countryCode": "GN",
        "label": {
          "en": "Guinea",
          "ar": "غينيا"
        }
      },
      {
        "countryCode": "GW",
        "label": {
          "en": "Guinea-Bissau",
          "ar": "غينيا بيساو"
        }
      },
      {
        "countryCode": "NE",
        "label": {
          "en": "Niger",
          "ar": "النيجر"
        }
      },
      {
        "countryCode": "ML",
        "label": {
          "en": "Mali",
          "ar": "مالي"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "west_africa"
    ],
    "similarityGroup": "food_new_kedjenou_ci",
    "distractorNearCodes": [
      "NG",
      "GH",
      "SN",
      "GM",
      "TG",
      "BJ",
      "GN",
      "GW",
      "NE",
      "ML"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA"
    ]
  },
  {
    "id": "food_new_ghormeh_sabzi_ir",
    "answer": "IR",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Ghormeh Sabzi",
      "ar": "قورمه سبزي"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_ghormeh_sabzi_ir.jpeg",
    "imageAlt": "Ghormeh Sabzi food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "IQ",
        "label": {
          "en": "Iraq",
          "ar": "العراق"
        }
      },
      {
        "countryCode": "AF",
        "label": {
          "en": "Afghanistan",
          "ar": "أفغانستان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "AZ",
        "label": {
          "en": "Azerbaijan",
          "ar": "أذربيجان"
        }
      },
      {
        "countryCode": "AM",
        "label": {
          "en": "Armenia",
          "ar": "أرمينيا"
        }
      },
      {
        "countryCode": "GE",
        "label": {
          "en": "Georgia",
          "ar": "جورجيا"
        }
      },
      {
        "countryCode": "RU",
        "label": {
          "en": "Russia",
          "ar": "روسيا"
        }
      },
      {
        "countryCode": "UZ",
        "label": {
          "en": "Uzbekistan",
          "ar": "أوزبكستان"
        }
      },
      {
        "countryCode": "KG",
        "label": {
          "en": "Kyrgyzstan",
          "ar": "قيرغيزستان"
        }
      },
      {
        "countryCode": "TJ",
        "label": {
          "en": "Tajikistan",
          "ar": "طاجيكستان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "stew",
      "caucasus"
    ],
    "similarityGroup": "food_new_ghormeh_sabzi_ir",
    "distractorNearCodes": [
      "IQ",
      "AF",
      "TR",
      "AZ",
      "AM",
      "GE",
      "RU",
      "UZ",
      "KG",
      "TJ"
    ],
    "distractorFarCodes": [
      "EG",
      "MA",
      "IN",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA",
      "IT",
      "BR"
    ]
  },
  {
    "id": "food_new_kikomando_ug",
    "answer": "UG",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Kikomando",
      "ar": "كيكوماندو"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_kikomando_ug.jpeg",
    "imageAlt": "Kikomando food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "UG",
        "label": {
          "en": "Uganda",
          "ar": "أوغندا"
        }
      },
      {
        "countryCode": "KE",
        "label": {
          "en": "Kenya",
          "ar": "كينيا"
        }
      },
      {
        "countryCode": "TZ",
        "label": {
          "en": "Tanzania",
          "ar": "تنزانيا"
        }
      },
      {
        "countryCode": "RW",
        "label": {
          "en": "Rwanda",
          "ar": "رواندا"
        }
      },
      {
        "countryCode": "BI",
        "label": {
          "en": "Burundi",
          "ar": "بوروندي"
        }
      },
      {
        "countryCode": "SO",
        "label": {
          "en": "Somalia",
          "ar": "الصومال"
        }
      },
      {
        "countryCode": "DJ",
        "label": {
          "en": "Djibouti",
          "ar": "جيبوتي"
        }
      },
      {
        "countryCode": "ET",
        "label": {
          "en": "Ethiopia",
          "ar": "إثيوبيا"
        }
      },
      {
        "countryCode": "ER",
        "label": {
          "en": "Eritrea",
          "ar": "إريتريا"
        }
      },
      {
        "countryCode": "SD",
        "label": {
          "en": "Sudan",
          "ar": "السودان"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "MX",
        "label": {
          "en": "Mexico",
          "ar": "المكسيك"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "snack",
      "east_africa"
    ],
    "similarityGroup": "food_new_kikomando_ug",
    "distractorNearCodes": [
      "KE",
      "TZ",
      "RW",
      "BI",
      "SO",
      "DJ",
      "ET",
      "ER",
      "SD"
    ],
    "distractorFarCodes": [
      "IN",
      "TR",
      "MX",
      "TH",
      "EG",
      "FR",
      "IT",
      "JP",
      "BR",
      "CN"
    ]
  },
  {
    "id": "food_new_kjotsupa_is",
    "answer": "IS",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Kjötsúpa",
      "ar": "شوربة لحم"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_kjotsupa_is.jpeg",
    "imageAlt": "Kjötsúpa food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "IS",
        "label": {
          "en": "Iceland",
          "ar": "آيسلندا"
        }
      },
      {
        "countryCode": "DK",
        "label": {
          "en": "Denmark",
          "ar": "الدانمرك"
        }
      },
      {
        "countryCode": "SE",
        "label": {
          "en": "Sweden",
          "ar": "السويد"
        }
      },
      {
        "countryCode": "NO",
        "label": {
          "en": "Norway",
          "ar": "النرويج"
        }
      },
      {
        "countryCode": "FI",
        "label": {
          "en": "Finland",
          "ar": "فنلندا"
        }
      },
      {
        "countryCode": "NL",
        "label": {
          "en": "Netherlands",
          "ar": "هولندا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "BE",
        "label": {
          "en": "Belgium",
          "ar": "بلجيكا"
        }
      },
      {
        "countryCode": "CH",
        "label": {
          "en": "Switzerland",
          "ar": "سويسرا"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "RU",
        "label": {
          "en": "Russia",
          "ar": "روسيا"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "soup",
      "nordic"
    ],
    "similarityGroup": "food_new_kjotsupa_is",
    "distractorNearCodes": [
      "DK",
      "SE",
      "NO",
      "FI",
      "NL",
      "DE",
      "FR",
      "BE",
      "CH",
      "GB"
    ],
    "distractorFarCodes": [
      "VN",
      "CN",
      "TR",
      "JP",
      "EG",
      "IN",
      "IT",
      "TH",
      "RU",
      "KR"
    ]
  },
  {
    "id": "food_new_klepe_ba",
    "answer": "BA",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Klepe",
      "ar": "كليبي"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_klepe_ba.jpeg",
    "imageAlt": "Klepe food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "BA",
        "label": {
          "en": "Bosnia & Herzegovina",
          "ar": "البوسنة والهرسك"
        }
      },
      {
        "countryCode": "RS",
        "label": {
          "en": "Serbia",
          "ar": "صربيا"
        }
      },
      {
        "countryCode": "HR",
        "label": {
          "en": "Croatia",
          "ar": "كرواتيا"
        }
      },
      {
        "countryCode": "ME",
        "label": {
          "en": "Montenegro",
          "ar": "الجبل الأسود"
        }
      },
      {
        "countryCode": "SI",
        "label": {
          "en": "Slovenia",
          "ar": "سلوفينيا"
        }
      },
      {
        "countryCode": "AL",
        "label": {
          "en": "Albania",
          "ar": "ألبانيا"
        }
      },
      {
        "countryCode": "MK",
        "label": {
          "en": "North Macedonia",
          "ar": "مقدونيا الشمالية"
        }
      },
      {
        "countryCode": "BG",
        "label": {
          "en": "Bulgaria",
          "ar": "بلغاريا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "RO",
        "label": {
          "en": "Romania",
          "ar": "رومانيا"
        }
      },
      {
        "countryCode": "XK",
        "label": {
          "en": "Kosovo",
          "ar": "كوسوفو"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "RU",
        "label": {
          "en": "Russia",
          "ar": "روسيا"
        }
      },
      {
        "countryCode": "PL",
        "label": {
          "en": "Poland",
          "ar": "بولندا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "GE",
        "label": {
          "en": "Georgia",
          "ar": "جورجيا"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "dumplings",
      "balkans"
    ],
    "similarityGroup": "food_new_klepe_ba",
    "distractorNearCodes": [
      "RS",
      "HR",
      "ME",
      "SI",
      "AL",
      "MK",
      "BG",
      "GR",
      "RO",
      "XK"
    ],
    "distractorFarCodes": [
      "CN",
      "JP",
      "TR",
      "RU",
      "PL",
      "IT",
      "GE",
      "KR",
      "IN",
      "EG"
    ]
  },
  {
    "id": "food_new_kottu_roti_lk",
    "answer": "LK",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Kottu Roti",
      "ar": "كوتو روتي"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_kottu_roti_lk.jpeg",
    "imageAlt": "Kottu Roti food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "LK",
        "label": {
          "en": "Sri Lanka",
          "ar": "سريلانكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "BD",
        "label": {
          "en": "Bangladesh",
          "ar": "بنغلاديش"
        }
      },
      {
        "countryCode": "NP",
        "label": {
          "en": "Nepal",
          "ar": "نيبال"
        }
      },
      {
        "countryCode": "BT",
        "label": {
          "en": "Bhutan",
          "ar": "بوتان"
        }
      },
      {
        "countryCode": "AF",
        "label": {
          "en": "Afghanistan",
          "ar": "أفغانستان"
        }
      },
      {
        "countryCode": "MV",
        "label": {
          "en": "Maldives",
          "ar": "جزر المالديف"
        }
      },
      {
        "countryCode": "UZ",
        "label": {
          "en": "Uzbekistan",
          "ar": "أوزبكستان"
        }
      },
      {
        "countryCode": "KG",
        "label": {
          "en": "Kyrgyzstan",
          "ar": "قيرغيزستان"
        }
      },
      {
        "countryCode": "TJ",
        "label": {
          "en": "Tajikistan",
          "ar": "طاجيكستان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "MX",
        "label": {
          "en": "Mexico",
          "ar": "المكسيك"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "snack",
      "south_asia"
    ],
    "similarityGroup": "food_new_kottu_roti_lk",
    "distractorNearCodes": [
      "IN",
      "PK",
      "BD",
      "NP",
      "BT",
      "AF",
      "MV",
      "UZ",
      "KG",
      "TJ"
    ],
    "distractorFarCodes": [
      "TR",
      "MX",
      "TH",
      "EG",
      "FR",
      "IT",
      "JP",
      "BR",
      "CN",
      "ES"
    ]
  },
  {
    "id": "food_new_swedish_meatballs_se",
    "answer": "SE",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Köttbullar",
      "ar": "كرات لحم"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_swedish_meatballs_se.jpeg",
    "imageAlt": "Swedish Meatballs food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "SE",
        "label": {
          "en": "Sweden",
          "ar": "السويد"
        }
      },
      {
        "countryCode": "DK",
        "label": {
          "en": "Denmark",
          "ar": "الدانمرك"
        }
      },
      {
        "countryCode": "NO",
        "label": {
          "en": "Norway",
          "ar": "النرويج"
        }
      },
      {
        "countryCode": "FI",
        "label": {
          "en": "Finland",
          "ar": "فنلندا"
        }
      },
      {
        "countryCode": "IS",
        "label": {
          "en": "Iceland",
          "ar": "آيسلندا"
        }
      },
      {
        "countryCode": "NL",
        "label": {
          "en": "Netherlands",
          "ar": "هولندا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "BE",
        "label": {
          "en": "Belgium",
          "ar": "بلجيكا"
        }
      },
      {
        "countryCode": "CH",
        "label": {
          "en": "Switzerland",
          "ar": "سويسرا"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "ZA",
        "label": {
          "en": "South Africa",
          "ar": "جنوب أفريقيا"
        }
      },
      {
        "countryCode": "AR",
        "label": {
          "en": "Argentina",
          "ar": "الأرجنتين"
        }
      },
      {
        "countryCode": "MX",
        "label": {
          "en": "Mexico",
          "ar": "المكسيك"
        }
      }
    ],
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "meat",
      "nordic"
    ],
    "similarityGroup": "food_new_swedish_meatballs_se",
    "distractorNearCodes": [
      "DK",
      "NO",
      "FI",
      "IS",
      "NL",
      "DE",
      "FR",
      "BE",
      "CH",
      "GB"
    ],
    "distractorFarCodes": [
      "TR",
      "GR",
      "EG",
      "SA",
      "BR",
      "US",
      "IN",
      "ZA",
      "AR",
      "MX"
    ]
  },
  {
    "id": "food_new_la_bandera_do",
    "answer": "DO",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "La Bandera",
      "ar": "لا بانديرا"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_la_bandera_do.jpeg",
    "imageAlt": "La Bandera food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "DO",
        "label": {
          "en": "Dominican Republic",
          "ar": "جمهورية الدومينيكان"
        }
      },
      {
        "countryCode": "HT",
        "label": {
          "en": "Haiti",
          "ar": "هايتي"
        }
      },
      {
        "countryCode": "CU",
        "label": {
          "en": "Cuba",
          "ar": "كوبا"
        }
      },
      {
        "countryCode": "JM",
        "label": {
          "en": "Jamaica",
          "ar": "جامايكا"
        }
      },
      {
        "countryCode": "PR",
        "label": {
          "en": "Puerto Rico",
          "ar": "بورتوريكو"
        }
      },
      {
        "countryCode": "BS",
        "label": {
          "en": "Bahamas",
          "ar": "جزر البهاما"
        }
      },
      {
        "countryCode": "BB",
        "label": {
          "en": "Barbados",
          "ar": "بربادوس"
        }
      },
      {
        "countryCode": "LC",
        "label": {
          "en": "St. Lucia",
          "ar": "سانت لوسيا"
        }
      },
      {
        "countryCode": "VC",
        "label": {
          "en": "St. Vincent & Grenadines",
          "ar": "سانت فنسنت وجزر غرينادين"
        }
      },
      {
        "countryCode": "GD",
        "label": {
          "en": "Grenada",
          "ar": "غرينادا"
        }
      },
      {
        "countryCode": "AG",
        "label": {
          "en": "Antigua & Barbuda",
          "ar": "أنتيغوا وبربودا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "ID",
        "label": {
          "en": "Indonesia",
          "ar": "إندونيسيا"
        }
      },
      {
        "countryCode": "MY",
        "label": {
          "en": "Malaysia",
          "ar": "ماليزيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "rice",
      "caribbean"
    ],
    "similarityGroup": "food_new_la_bandera_do",
    "distractorNearCodes": [
      "HT",
      "CU",
      "JM",
      "PR",
      "BS",
      "BB",
      "LC",
      "VC",
      "GD",
      "AG"
    ],
    "distractorFarCodes": [
      "IN",
      "PK",
      "TR",
      "SA",
      "EG",
      "ID",
      "MY",
      "JP",
      "CN",
      "TH"
    ]
  },
  {
    "id": "food_new_lamingtons_au",
    "answer": "AU",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Lamingtons",
      "ar": "لامينجتون"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_lamingtons_au.jpeg",
    "imageAlt": "Lamingtons food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "AU",
        "label": {
          "en": "Australia",
          "ar": "أستراليا"
        }
      },
      {
        "countryCode": "NZ",
        "label": {
          "en": "New Zealand",
          "ar": "نيوزيلندا"
        }
      },
      {
        "countryCode": "FJ",
        "label": {
          "en": "Fiji",
          "ar": "فيجي"
        }
      },
      {
        "countryCode": "PG",
        "label": {
          "en": "Papua New Guinea",
          "ar": "بابوا غينيا الجديدة"
        }
      },
      {
        "countryCode": "VU",
        "label": {
          "en": "Vanuatu",
          "ar": "فانواتو"
        }
      },
      {
        "countryCode": "TO",
        "label": {
          "en": "Tonga",
          "ar": "تونغا"
        }
      },
      {
        "countryCode": "WS",
        "label": {
          "en": "Samoa",
          "ar": "ساموا"
        }
      },
      {
        "countryCode": "KI",
        "label": {
          "en": "Kiribati",
          "ar": "كيريباتي"
        }
      },
      {
        "countryCode": "MH",
        "label": {
          "en": "Marshall Islands",
          "ar": "جزر مارشال"
        }
      },
      {
        "countryCode": "FM",
        "label": {
          "en": "Micronesia",
          "ar": "ميكرونيزيا"
        }
      },
      {
        "countryCode": "SB",
        "label": {
          "en": "Solomon Islands",
          "ar": "جزر سليمان"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "BE",
        "label": {
          "en": "Belgium",
          "ar": "بلجيكا"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "dessert",
      "oceania"
    ],
    "similarityGroup": "food_new_lamingtons_au",
    "distractorNearCodes": [
      "NZ",
      "FJ",
      "PG",
      "VU",
      "TO",
      "WS",
      "KI",
      "MH",
      "FM",
      "SB"
    ],
    "distractorFarCodes": [
      "FR",
      "IT",
      "TR",
      "EG",
      "BE",
      "US",
      "GR",
      "IN",
      "BR",
      "ES"
    ]
  },
  {
    "id": "food_new_lap_lap_vu",
    "answer": "VU",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Lap Lap",
      "ar": "لاب لاب"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_lap_lap_vu.jpeg",
    "imageAlt": "Lap Lap food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "VU",
        "label": {
          "en": "Vanuatu",
          "ar": "فانواتو"
        }
      },
      {
        "countryCode": "FJ",
        "label": {
          "en": "Fiji",
          "ar": "فيجي"
        }
      },
      {
        "countryCode": "TO",
        "label": {
          "en": "Tonga",
          "ar": "تونغا"
        }
      },
      {
        "countryCode": "WS",
        "label": {
          "en": "Samoa",
          "ar": "ساموا"
        }
      },
      {
        "countryCode": "PG",
        "label": {
          "en": "Papua New Guinea",
          "ar": "بابوا غينيا الجديدة"
        }
      },
      {
        "countryCode": "AU",
        "label": {
          "en": "Australia",
          "ar": "أستراليا"
        }
      },
      {
        "countryCode": "NZ",
        "label": {
          "en": "New Zealand",
          "ar": "نيوزيلندا"
        }
      },
      {
        "countryCode": "KI",
        "label": {
          "en": "Kiribati",
          "ar": "كيريباتي"
        }
      },
      {
        "countryCode": "MH",
        "label": {
          "en": "Marshall Islands",
          "ar": "جزر مارشال"
        }
      },
      {
        "countryCode": "FM",
        "label": {
          "en": "Micronesia",
          "ar": "ميكرونيزيا"
        }
      },
      {
        "countryCode": "SB",
        "label": {
          "en": "Solomon Islands",
          "ar": "جزر سليمان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "oceania"
    ],
    "similarityGroup": "food_new_lap_lap_vu",
    "distractorNearCodes": [
      "FJ",
      "TO",
      "WS",
      "PG",
      "AU",
      "NZ",
      "KI",
      "MH",
      "FM",
      "SB"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA"
    ]
  },
  {
    "id": "food_new_argentine_locro_ar",
    "answer": "AR",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Locro",
      "ar": "لوكرو"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_argentine_locro_ar.jpeg",
    "imageAlt": "Argentine Locro food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "AR",
        "label": {
          "en": "Argentina",
          "ar": "الأرجنتين"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "UY",
        "label": {
          "en": "Uruguay",
          "ar": "أورغواي"
        }
      },
      {
        "countryCode": "PY",
        "label": {
          "en": "Paraguay",
          "ar": "باراغواي"
        }
      },
      {
        "countryCode": "BO",
        "label": {
          "en": "Bolivia",
          "ar": "بوليفيا"
        }
      },
      {
        "countryCode": "CL",
        "label": {
          "en": "Chile",
          "ar": "تشيلي"
        }
      },
      {
        "countryCode": "PE",
        "label": {
          "en": "Peru",
          "ar": "بيرو"
        }
      },
      {
        "countryCode": "EC",
        "label": {
          "en": "Ecuador",
          "ar": "الإكوادور"
        }
      },
      {
        "countryCode": "CO",
        "label": {
          "en": "Colombia",
          "ar": "كولومبيا"
        }
      },
      {
        "countryCode": "VE",
        "label": {
          "en": "Venezuela",
          "ar": "فنزويلا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "latam_south"
    ],
    "similarityGroup": "food_new_argentine_locro_ar",
    "distractorNearCodes": [
      "BR",
      "UY",
      "PY",
      "BO",
      "CL",
      "PE",
      "EC",
      "CO",
      "VE"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA"
    ]
  },
  {
    "id": "food_new_makayabu_cg",
    "answer": "CG",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Makayabu",
      "ar": "ماكايابو"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_makayabu_cg.jpeg",
    "imageAlt": "Makayabu food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "CG",
        "label": {
          "en": "Republic of the Congo",
          "ar": "الكونغو"
        }
      },
      {
        "countryCode": "CD",
        "label": {
          "en": "DR Congo",
          "ar": "الكونغو الديمقراطية"
        }
      },
      {
        "countryCode": "CM",
        "label": {
          "en": "Cameroon",
          "ar": "الكاميرون"
        }
      },
      {
        "countryCode": "AO",
        "label": {
          "en": "Angola",
          "ar": "أنغولا"
        }
      },
      {
        "countryCode": "GA",
        "label": {
          "en": "Gabon",
          "ar": "الغابون"
        }
      },
      {
        "countryCode": "CF",
        "label": {
          "en": "Central African Republic",
          "ar": "جمهورية أفريقيا الوسطى"
        }
      },
      {
        "countryCode": "TD",
        "label": {
          "en": "Chad",
          "ar": "تشاد"
        }
      },
      {
        "countryCode": "ST",
        "label": {
          "en": "São Tomé and Príncipe",
          "ar": "ساو تومي وبرينسيبي"
        }
      },
      {
        "countryCode": "GQ",
        "label": {
          "en": "Equatorial Guinea",
          "ar": "غينيا الاستوائية"
        }
      },
      {
        "countryCode": "ZM",
        "label": {
          "en": "Zambia",
          "ar": "زامبيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "PT",
        "label": {
          "en": "Portugal",
          "ar": "البرتغال"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "seafood",
      "central_africa"
    ],
    "similarityGroup": "food_new_makayabu_cg",
    "distractorNearCodes": [
      "CD",
      "CM",
      "AO",
      "GA",
      "CF",
      "TD",
      "ST",
      "GQ",
      "ZM"
    ],
    "distractorFarCodes": [
      "JP",
      "GR",
      "IT",
      "ES",
      "TH",
      "FR",
      "EG",
      "PT",
      "KR",
      "GB"
    ]
  },
  {
    "id": "food_new_mandi_ye",
    "answer": "YE",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Mandi",
      "ar": "مندي"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_mandi_ye.jpeg",
    "imageAlt": "Mandi food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "OM",
        "label": {
          "en": "Oman",
          "ar": "عُمان"
        }
      },
      {
        "countryCode": "AE",
        "label": {
          "en": "United Arab Emirates",
          "ar": "الإمارات"
        }
      },
      {
        "countryCode": "JO",
        "label": {
          "en": "Jordan",
          "ar": "الأردن"
        }
      },
      {
        "countryCode": "IQ",
        "label": {
          "en": "Iraq",
          "ar": "العراق"
        }
      },
      {
        "countryCode": "KW",
        "label": {
          "en": "Kuwait",
          "ar": "الكويت"
        }
      },
      {
        "countryCode": "QA",
        "label": {
          "en": "Qatar",
          "ar": "قطر"
        }
      },
      {
        "countryCode": "BH",
        "label": {
          "en": "Bahrain",
          "ar": "البحرين"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "ID",
        "label": {
          "en": "Indonesia",
          "ar": "إندونيسيا"
        }
      },
      {
        "countryCode": "MY",
        "label": {
          "en": "Malaysia",
          "ar": "ماليزيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      }
    ],
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "rice",
      "gulf"
    ],
    "similarityGroup": "food_new_mandi_ye",
    "distractorNearCodes": [
      "SA",
      "OM",
      "AE",
      "JO",
      "IQ",
      "KW",
      "QA",
      "BH"
    ],
    "distractorFarCodes": [
      "IN",
      "PK",
      "TR",
      "EG",
      "ID",
      "MY",
      "JP",
      "CN",
      "TH",
      "VN"
    ]
  },
  {
    "id": "food_new_mansaf_jo",
    "answer": "JO",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Mansaf",
      "ar": "منسف"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_mansaf_jo.jpeg",
    "imageAlt": "Mansaf food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "JO",
        "label": {
          "en": "Jordan",
          "ar": "الأردن"
        }
      },
      {
        "countryCode": "SY",
        "label": {
          "en": "Syria",
          "ar": "سوريا"
        }
      },
      {
        "countryCode": "LB",
        "label": {
          "en": "Lebanon",
          "ar": "لبنان"
        }
      },
      {
        "countryCode": "PS",
        "label": {
          "en": "Palestine",
          "ar": "فلسطين"
        }
      },
      {
        "countryCode": "IQ",
        "label": {
          "en": "Iraq",
          "ar": "العراق"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "AE",
        "label": {
          "en": "United Arab Emirates",
          "ar": "الإمارات"
        }
      },
      {
        "countryCode": "OM",
        "label": {
          "en": "Oman",
          "ar": "عُمان"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "ID",
        "label": {
          "en": "Indonesia",
          "ar": "إندونيسيا"
        }
      },
      {
        "countryCode": "MY",
        "label": {
          "en": "Malaysia",
          "ar": "ماليزيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "rice",
      "levant"
    ],
    "similarityGroup": "food_new_mansaf_jo",
    "distractorNearCodes": [
      "SY",
      "LB",
      "PS",
      "IQ",
      "SA",
      "TR",
      "EG",
      "YE",
      "AE",
      "OM"
    ],
    "distractorFarCodes": [
      "IN",
      "PK",
      "ID",
      "MY",
      "JP",
      "CN",
      "TH",
      "VN",
      "BR",
      "GR"
    ]
  },
  {
    "id": "food_new_maori_boil_up_nz",
    "answer": "NZ",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Māori Boil-Up",
      "ar": "بول آب"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_maori_boil_up_nz.jpeg",
    "imageAlt": "Māori Boil-Up food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "NZ",
        "label": {
          "en": "New Zealand",
          "ar": "نيوزيلندا"
        }
      },
      {
        "countryCode": "AU",
        "label": {
          "en": "Australia",
          "ar": "أستراليا"
        }
      },
      {
        "countryCode": "FJ",
        "label": {
          "en": "Fiji",
          "ar": "فيجي"
        }
      },
      {
        "countryCode": "TO",
        "label": {
          "en": "Tonga",
          "ar": "تونغا"
        }
      },
      {
        "countryCode": "WS",
        "label": {
          "en": "Samoa",
          "ar": "ساموا"
        }
      },
      {
        "countryCode": "VU",
        "label": {
          "en": "Vanuatu",
          "ar": "فانواتو"
        }
      },
      {
        "countryCode": "PG",
        "label": {
          "en": "Papua New Guinea",
          "ar": "بابوا غينيا الجديدة"
        }
      },
      {
        "countryCode": "KI",
        "label": {
          "en": "Kiribati",
          "ar": "كيريباتي"
        }
      },
      {
        "countryCode": "MH",
        "label": {
          "en": "Marshall Islands",
          "ar": "جزر مارشال"
        }
      },
      {
        "countryCode": "FM",
        "label": {
          "en": "Micronesia",
          "ar": "ميكرونيزيا"
        }
      },
      {
        "countryCode": "SB",
        "label": {
          "en": "Solomon Islands",
          "ar": "جزر سليمان"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "RU",
        "label": {
          "en": "Russia",
          "ar": "روسيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "soup",
      "oceania"
    ],
    "similarityGroup": "food_new_maori_boil_up_nz",
    "distractorNearCodes": [
      "AU",
      "FJ",
      "TO",
      "WS",
      "VU",
      "PG",
      "KI",
      "MH",
      "FM",
      "SB"
    ],
    "distractorFarCodes": [
      "VN",
      "CN",
      "TR",
      "JP",
      "EG",
      "IN",
      "FR",
      "IT",
      "TH",
      "RU"
    ]
  },
  {
    "id": "food_new_masgouf_iq",
    "answer": "IQ",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Masgouf",
      "ar": "مسكوف"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_masgouf_iq.jpeg",
    "imageAlt": "Masgouf food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "IQ",
        "label": {
          "en": "Iraq",
          "ar": "العراق"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "SY",
        "label": {
          "en": "Syria",
          "ar": "سوريا"
        }
      },
      {
        "countryCode": "JO",
        "label": {
          "en": "Jordan",
          "ar": "الأردن"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "LB",
        "label": {
          "en": "Lebanon",
          "ar": "لبنان"
        }
      },
      {
        "countryCode": "PS",
        "label": {
          "en": "Palestine",
          "ar": "فلسطين"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "PT",
        "label": {
          "en": "Portugal",
          "ar": "البرتغال"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "PH",
        "label": {
          "en": "Philippines",
          "ar": "الفلبين"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "seafood",
      "levant"
    ],
    "similarityGroup": "food_new_masgouf_iq",
    "distractorNearCodes": [
      "IR",
      "SY",
      "JO",
      "TR",
      "SA",
      "LB",
      "PS",
      "EG"
    ],
    "distractorFarCodes": [
      "JP",
      "GR",
      "IT",
      "ES",
      "TH",
      "FR",
      "PT",
      "KR",
      "GB",
      "PH"
    ]
  },
  {
    "id": "food_new_mohinga_mm",
    "answer": "MM",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Mohinga",
      "ar": "موهينجا"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_mohinga_mm.jpeg",
    "imageAlt": "Mohinga food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "MM",
        "label": {
          "en": "Myanmar (Burma)",
          "ar": "ميانمار (بورما)"
        }
      },
      {
        "countryCode": "PH",
        "label": {
          "en": "Philippines",
          "ar": "الفلبين"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "ID",
        "label": {
          "en": "Indonesia",
          "ar": "إندونيسيا"
        }
      },
      {
        "countryCode": "MY",
        "label": {
          "en": "Malaysia",
          "ar": "ماليزيا"
        }
      },
      {
        "countryCode": "SG",
        "label": {
          "en": "Singapore",
          "ar": "سنغافورة"
        }
      },
      {
        "countryCode": "KH",
        "label": {
          "en": "Cambodia",
          "ar": "كمبوديا"
        }
      },
      {
        "countryCode": "LA",
        "label": {
          "en": "Laos",
          "ar": "لاوس"
        }
      },
      {
        "countryCode": "BN",
        "label": {
          "en": "Brunei",
          "ar": "بروناي"
        }
      },
      {
        "countryCode": "TL",
        "label": {
          "en": "Timor-Leste",
          "ar": "تيمور الشرقية"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "noodles",
      "southeast_asia"
    ],
    "similarityGroup": "food_new_mohinga_mm",
    "distractorNearCodes": [
      "PH",
      "TH",
      "VN",
      "ID",
      "MY",
      "SG",
      "KH",
      "LA",
      "BN",
      "TL"
    ],
    "distractorFarCodes": [
      "CN",
      "JP",
      "IT",
      "KR",
      "IN",
      "US",
      "EG",
      "FR",
      "ES",
      "GB"
    ]
  },
  {
    "id": "food_new_greek_moussaka_gr",
    "answer": "GR",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Moussaka",
      "ar": "مسقعة"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_greek_moussaka_gr.jpeg",
    "imageAlt": "Greek Moussaka food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "CY",
        "label": {
          "en": "Cyprus",
          "ar": "قبرص"
        }
      },
      {
        "countryCode": "AL",
        "label": {
          "en": "Albania",
          "ar": "ألبانيا"
        }
      },
      {
        "countryCode": "BG",
        "label": {
          "en": "Bulgaria",
          "ar": "بلغاريا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "PT",
        "label": {
          "en": "Portugal",
          "ar": "البرتغال"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "MT",
        "label": {
          "en": "Malta",
          "ar": "مالطا"
        }
      },
      {
        "countryCode": "HR",
        "label": {
          "en": "Croatia",
          "ar": "كرواتيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "DZ",
        "label": {
          "en": "Algeria",
          "ar": "الجزائر"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "stew",
      "med_europe"
    ],
    "similarityGroup": "food_new_greek_moussaka_gr",
    "distractorNearCodes": [
      "IT",
      "TR",
      "CY",
      "AL",
      "BG",
      "ES",
      "PT",
      "FR",
      "MT",
      "HR"
    ],
    "distractorFarCodes": [
      "EG",
      "MA",
      "IN",
      "IR",
      "YE",
      "PK",
      "SA",
      "BR",
      "DZ",
      "TH"
    ]
  },
  {
    "id": "food_new_muamba_de_galinha_ao",
    "answer": "AO",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Muamba de Galinha",
      "ar": "موامبا دجاج"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_muamba_de_galinha_ao.jpeg",
    "imageAlt": "Muamba de Galinha food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "AO",
        "label": {
          "en": "Angola",
          "ar": "أنغولا"
        }
      },
      {
        "countryCode": "ZA",
        "label": {
          "en": "South Africa",
          "ar": "جنوب أفريقيا"
        }
      },
      {
        "countryCode": "BW",
        "label": {
          "en": "Botswana",
          "ar": "بوتسوانا"
        }
      },
      {
        "countryCode": "NA",
        "label": {
          "en": "Namibia",
          "ar": "ناميبيا"
        }
      },
      {
        "countryCode": "ZW",
        "label": {
          "en": "Zimbabwe",
          "ar": "زيمبابوي"
        }
      },
      {
        "countryCode": "LS",
        "label": {
          "en": "Lesotho",
          "ar": "ليسوتو"
        }
      },
      {
        "countryCode": "SZ",
        "label": {
          "en": "Eswatini",
          "ar": "إسواتيني"
        }
      },
      {
        "countryCode": "MW",
        "label": {
          "en": "Malawi",
          "ar": "ملاوي"
        }
      },
      {
        "countryCode": "MZ",
        "label": {
          "en": "Mozambique",
          "ar": "موزمبيق"
        }
      },
      {
        "countryCode": "ZM",
        "label": {
          "en": "Zambia",
          "ar": "زامبيا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "southern_africa"
    ],
    "similarityGroup": "food_new_muamba_de_galinha_ao",
    "distractorNearCodes": [
      "ZA",
      "BW",
      "NA",
      "ZW",
      "LS",
      "SZ",
      "MW",
      "MZ",
      "ZM"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA"
    ]
  },
  {
    "id": "food_new_mumu_pg",
    "answer": "PG",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Mumu",
      "ar": "مومو غينيا الجديدة"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_mumu_pg.jpeg",
    "imageAlt": "Mumu food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "PG",
        "label": {
          "en": "Papua New Guinea",
          "ar": "بابوا غينيا الجديدة"
        }
      },
      {
        "countryCode": "FJ",
        "label": {
          "en": "Fiji",
          "ar": "فيجي"
        }
      },
      {
        "countryCode": "VU",
        "label": {
          "en": "Vanuatu",
          "ar": "فانواتو"
        }
      },
      {
        "countryCode": "AU",
        "label": {
          "en": "Australia",
          "ar": "أستراليا"
        }
      },
      {
        "countryCode": "NZ",
        "label": {
          "en": "New Zealand",
          "ar": "نيوزيلندا"
        }
      },
      {
        "countryCode": "SB",
        "label": {
          "en": "Solomon Islands",
          "ar": "جزر سليمان"
        }
      },
      {
        "countryCode": "WS",
        "label": {
          "en": "Samoa",
          "ar": "ساموا"
        }
      },
      {
        "countryCode": "TO",
        "label": {
          "en": "Tonga",
          "ar": "تونغا"
        }
      },
      {
        "countryCode": "KI",
        "label": {
          "en": "Kiribati",
          "ar": "كيريباتي"
        }
      },
      {
        "countryCode": "MH",
        "label": {
          "en": "Marshall Islands",
          "ar": "جزر مارشال"
        }
      },
      {
        "countryCode": "FM",
        "label": {
          "en": "Micronesia",
          "ar": "ميكرونيزيا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "ZA",
        "label": {
          "en": "South Africa",
          "ar": "جنوب أفريقيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "meat",
      "oceania"
    ],
    "similarityGroup": "food_new_mumu_pg",
    "distractorNearCodes": [
      "FJ",
      "VU",
      "AU",
      "NZ",
      "SB",
      "WS",
      "TO",
      "KI",
      "MH",
      "FM"
    ],
    "distractorFarCodes": [
      "TR",
      "DE",
      "GR",
      "EG",
      "SA",
      "BR",
      "US",
      "IN",
      "FR",
      "ZA"
    ]
  },
  {
    "id": "food_new_nasi_katok_bn",
    "answer": "BN",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Nasi Katok",
      "ar": "ناسي كاتوك"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_nasi_katok_bn.jpeg",
    "imageAlt": "Nasi Katok food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "BN",
        "label": {
          "en": "Brunei",
          "ar": "بروناي"
        }
      },
      {
        "countryCode": "MY",
        "label": {
          "en": "Malaysia",
          "ar": "ماليزيا"
        }
      },
      {
        "countryCode": "ID",
        "label": {
          "en": "Indonesia",
          "ar": "إندونيسيا"
        }
      },
      {
        "countryCode": "SG",
        "label": {
          "en": "Singapore",
          "ar": "سنغافورة"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "PH",
        "label": {
          "en": "Philippines",
          "ar": "الفلبين"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "KH",
        "label": {
          "en": "Cambodia",
          "ar": "كمبوديا"
        }
      },
      {
        "countryCode": "LA",
        "label": {
          "en": "Laos",
          "ar": "لاوس"
        }
      },
      {
        "countryCode": "MM",
        "label": {
          "en": "Myanmar (Burma)",
          "ar": "ميانمار (بورما)"
        }
      },
      {
        "countryCode": "TL",
        "label": {
          "en": "Timor-Leste",
          "ar": "تيمور الشرقية"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "AE",
        "label": {
          "en": "United Arab Emirates",
          "ar": "الإمارات"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "rice",
      "southeast_asia"
    ],
    "similarityGroup": "food_new_nasi_katok_bn",
    "distractorNearCodes": [
      "MY",
      "ID",
      "SG",
      "TH",
      "PH",
      "VN",
      "KH",
      "LA",
      "MM",
      "TL"
    ],
    "distractorFarCodes": [
      "IN",
      "PK",
      "TR",
      "SA",
      "EG",
      "JP",
      "CN",
      "BR",
      "GR",
      "AE"
    ]
  },
  {
    "id": "food_new_nihari_in",
    "answer": "IN",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Nihari",
      "ar": "نهاري"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_nihari_in.jpeg",
    "imageAlt": "Nihari food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "BD",
        "label": {
          "en": "Bangladesh",
          "ar": "بنغلاديش"
        }
      },
      {
        "countryCode": "NP",
        "label": {
          "en": "Nepal",
          "ar": "نيبال"
        }
      },
      {
        "countryCode": "LK",
        "label": {
          "en": "Sri Lanka",
          "ar": "سريلانكا"
        }
      },
      {
        "countryCode": "AF",
        "label": {
          "en": "Afghanistan",
          "ar": "أفغانستان"
        }
      },
      {
        "countryCode": "BT",
        "label": {
          "en": "Bhutan",
          "ar": "بوتان"
        }
      },
      {
        "countryCode": "MV",
        "label": {
          "en": "Maldives",
          "ar": "جزر المالديف"
        }
      },
      {
        "countryCode": "UZ",
        "label": {
          "en": "Uzbekistan",
          "ar": "أوزبكستان"
        }
      },
      {
        "countryCode": "KG",
        "label": {
          "en": "Kyrgyzstan",
          "ar": "قيرغيزستان"
        }
      },
      {
        "countryCode": "TJ",
        "label": {
          "en": "Tajikistan",
          "ar": "طاجيكستان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "south_asia"
    ],
    "similarityGroup": "food_new_nihari_in",
    "distractorNearCodes": [
      "PK",
      "BD",
      "NP",
      "LK",
      "AF",
      "BT",
      "MV",
      "UZ",
      "KG",
      "TJ"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IR",
      "FR",
      "GR",
      "YE",
      "SA",
      "IT",
      "BR"
    ]
  },
  {
    "id": "food_new_oil_down_gd",
    "answer": "GD",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Oil Down",
      "ar": "أويل داون"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_oil_down_gd.jpeg",
    "imageAlt": "Oil Down food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "GD",
        "label": {
          "en": "Grenada",
          "ar": "غرينادا"
        }
      },
      {
        "countryCode": "JM",
        "label": {
          "en": "Jamaica",
          "ar": "جامايكا"
        }
      },
      {
        "countryCode": "HT",
        "label": {
          "en": "Haiti",
          "ar": "هايتي"
        }
      },
      {
        "countryCode": "DO",
        "label": {
          "en": "Dominican Republic",
          "ar": "جمهورية الدومينيكان"
        }
      },
      {
        "countryCode": "CU",
        "label": {
          "en": "Cuba",
          "ar": "كوبا"
        }
      },
      {
        "countryCode": "BS",
        "label": {
          "en": "Bahamas",
          "ar": "جزر البهاما"
        }
      },
      {
        "countryCode": "BB",
        "label": {
          "en": "Barbados",
          "ar": "بربادوس"
        }
      },
      {
        "countryCode": "LC",
        "label": {
          "en": "St. Lucia",
          "ar": "سانت لوسيا"
        }
      },
      {
        "countryCode": "VC",
        "label": {
          "en": "St. Vincent & Grenadines",
          "ar": "سانت فنسنت وجزر غرينادين"
        }
      },
      {
        "countryCode": "AG",
        "label": {
          "en": "Antigua & Barbuda",
          "ar": "أنتيغوا وبربودا"
        }
      },
      {
        "countryCode": "GY",
        "label": {
          "en": "Guyana",
          "ar": "غيانا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "caribbean"
    ],
    "similarityGroup": "food_new_oil_down_gd",
    "distractorNearCodes": [
      "JM",
      "HT",
      "DO",
      "CU",
      "BS",
      "BB",
      "LC",
      "VC",
      "AG",
      "GY"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA"
    ]
  },
  {
    "id": "food_new_pad_thai_th",
    "answer": "TH",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Pad Thai",
      "ar": "باد تاي"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_pad_thai_th.jpeg",
    "imageAlt": "Pad Thai food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "PH",
        "label": {
          "en": "Philippines",
          "ar": "الفلبين"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "ID",
        "label": {
          "en": "Indonesia",
          "ar": "إندونيسيا"
        }
      },
      {
        "countryCode": "MY",
        "label": {
          "en": "Malaysia",
          "ar": "ماليزيا"
        }
      },
      {
        "countryCode": "SG",
        "label": {
          "en": "Singapore",
          "ar": "سنغافورة"
        }
      },
      {
        "countryCode": "KH",
        "label": {
          "en": "Cambodia",
          "ar": "كمبوديا"
        }
      },
      {
        "countryCode": "LA",
        "label": {
          "en": "Laos",
          "ar": "لاوس"
        }
      },
      {
        "countryCode": "MM",
        "label": {
          "en": "Myanmar (Burma)",
          "ar": "ميانمار (بورما)"
        }
      },
      {
        "countryCode": "BN",
        "label": {
          "en": "Brunei",
          "ar": "بروناي"
        }
      },
      {
        "countryCode": "TL",
        "label": {
          "en": "Timor-Leste",
          "ar": "تيمور الشرقية"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "easy",
    "tags": [
      "noodles",
      "southeast_asia"
    ],
    "similarityGroup": "food_new_pad_thai_th",
    "distractorNearCodes": [
      "PH",
      "VN",
      "ID",
      "MY",
      "SG",
      "KH",
      "LA",
      "MM",
      "BN",
      "TL"
    ],
    "distractorFarCodes": [
      "CN",
      "JP",
      "IT",
      "KR",
      "IN",
      "US",
      "EG",
      "FR",
      "ES",
      "GB"
    ]
  },
  {
    "id": "food_new_pani_popo_ws",
    "answer": "WS",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Pani Popo",
      "ar": "باني بوبو"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_pani_popo_ws.jpeg",
    "imageAlt": "Pani Popo food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "WS",
        "label": {
          "en": "Samoa",
          "ar": "ساموا"
        }
      },
      {
        "countryCode": "AU",
        "label": {
          "en": "Australia",
          "ar": "أستراليا"
        }
      },
      {
        "countryCode": "NZ",
        "label": {
          "en": "New Zealand",
          "ar": "نيوزيلندا"
        }
      },
      {
        "countryCode": "FJ",
        "label": {
          "en": "Fiji",
          "ar": "فيجي"
        }
      },
      {
        "countryCode": "TO",
        "label": {
          "en": "Tonga",
          "ar": "تونغا"
        }
      },
      {
        "countryCode": "VU",
        "label": {
          "en": "Vanuatu",
          "ar": "فانواتو"
        }
      },
      {
        "countryCode": "PG",
        "label": {
          "en": "Papua New Guinea",
          "ar": "بابوا غينيا الجديدة"
        }
      },
      {
        "countryCode": "KI",
        "label": {
          "en": "Kiribati",
          "ar": "كيريباتي"
        }
      },
      {
        "countryCode": "MH",
        "label": {
          "en": "Marshall Islands",
          "ar": "جزر مارشال"
        }
      },
      {
        "countryCode": "FM",
        "label": {
          "en": "Micronesia",
          "ar": "ميكرونيزيا"
        }
      },
      {
        "countryCode": "SB",
        "label": {
          "en": "Solomon Islands",
          "ar": "جزر سليمان"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "BE",
        "label": {
          "en": "Belgium",
          "ar": "بلجيكا"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "dessert",
      "oceania"
    ],
    "similarityGroup": "food_new_pani_popo_ws",
    "distractorNearCodes": [
      "AU",
      "NZ",
      "FJ",
      "TO",
      "VU",
      "PG",
      "KI",
      "MH",
      "FM",
      "SB"
    ],
    "distractorFarCodes": [
      "FR",
      "IT",
      "TR",
      "EG",
      "BE",
      "US",
      "GR",
      "IN",
      "BR",
      "ES"
    ]
  },
  {
    "id": "food_new_pepian_gt",
    "answer": "GT",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Pepián",
      "ar": "بيبيان"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_pepian_gt.jpeg",
    "imageAlt": "Pepián food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "GT",
        "label": {
          "en": "Guatemala",
          "ar": "غواتيمالا"
        }
      },
      {
        "countryCode": "MX",
        "label": {
          "en": "Mexico",
          "ar": "المكسيك"
        }
      },
      {
        "countryCode": "HN",
        "label": {
          "en": "Honduras",
          "ar": "هندوراس"
        }
      },
      {
        "countryCode": "SV",
        "label": {
          "en": "El Salvador",
          "ar": "السلفادور"
        }
      },
      {
        "countryCode": "NI",
        "label": {
          "en": "Nicaragua",
          "ar": "نيكاراغوا"
        }
      },
      {
        "countryCode": "CR",
        "label": {
          "en": "Costa Rica",
          "ar": "كوستاريكا"
        }
      },
      {
        "countryCode": "PA",
        "label": {
          "en": "Panama",
          "ar": "بنما"
        }
      },
      {
        "countryCode": "CO",
        "label": {
          "en": "Colombia",
          "ar": "كولومبيا"
        }
      },
      {
        "countryCode": "CU",
        "label": {
          "en": "Cuba",
          "ar": "كوبا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "latam_central"
    ],
    "similarityGroup": "food_new_pepian_gt",
    "distractorNearCodes": [
      "MX",
      "HN",
      "SV",
      "NI",
      "CR",
      "PA",
      "CO",
      "CU"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA"
    ]
  },
  {
    "id": "food_new_guyanese_pepperpot_gy",
    "answer": "GY",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Pepperpot",
      "ar": "ببر بوت"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_guyanese_pepperpot_gy.jpeg",
    "imageAlt": "Guyanese Pepperpot food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "GY",
        "label": {
          "en": "Guyana",
          "ar": "غيانا"
        }
      },
      {
        "countryCode": "SR",
        "label": {
          "en": "Suriname",
          "ar": "سورينام"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "VE",
        "label": {
          "en": "Venezuela",
          "ar": "فنزويلا"
        }
      },
      {
        "countryCode": "TT",
        "label": {
          "en": "Trinidad & Tobago",
          "ar": "ترينيداد وتوباغو"
        }
      },
      {
        "countryCode": "JM",
        "label": {
          "en": "Jamaica",
          "ar": "جامايكا"
        }
      },
      {
        "countryCode": "HT",
        "label": {
          "en": "Haiti",
          "ar": "هايتي"
        }
      },
      {
        "countryCode": "DO",
        "label": {
          "en": "Dominican Republic",
          "ar": "جمهورية الدومينيكان"
        }
      },
      {
        "countryCode": "CU",
        "label": {
          "en": "Cuba",
          "ar": "كوبا"
        }
      },
      {
        "countryCode": "BS",
        "label": {
          "en": "Bahamas",
          "ar": "جزر البهاما"
        }
      },
      {
        "countryCode": "BB",
        "label": {
          "en": "Barbados",
          "ar": "بربادوس"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "caribbean"
    ],
    "similarityGroup": "food_new_guyanese_pepperpot_gy",
    "distractorNearCodes": [
      "SR",
      "BR",
      "VE",
      "TT",
      "JM",
      "HT",
      "DO",
      "CU",
      "BS",
      "BB"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA"
    ]
  },
  {
    "id": "food_new_pljeskavica_rs",
    "answer": "RS",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Pljeskavica",
      "ar": "بليسكافيتسا"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_pljeskavica_rs.jpeg",
    "imageAlt": "Pljeskavica food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "RS",
        "label": {
          "en": "Serbia",
          "ar": "صربيا"
        }
      },
      {
        "countryCode": "BA",
        "label": {
          "en": "Bosnia & Herzegovina",
          "ar": "البوسنة والهرسك"
        }
      },
      {
        "countryCode": "HR",
        "label": {
          "en": "Croatia",
          "ar": "كرواتيا"
        }
      },
      {
        "countryCode": "MK",
        "label": {
          "en": "North Macedonia",
          "ar": "مقدونيا الشمالية"
        }
      },
      {
        "countryCode": "BG",
        "label": {
          "en": "Bulgaria",
          "ar": "بلغاريا"
        }
      },
      {
        "countryCode": "RO",
        "label": {
          "en": "Romania",
          "ar": "رومانيا"
        }
      },
      {
        "countryCode": "AL",
        "label": {
          "en": "Albania",
          "ar": "ألبانيا"
        }
      },
      {
        "countryCode": "SI",
        "label": {
          "en": "Slovenia",
          "ar": "سلوفينيا"
        }
      },
      {
        "countryCode": "ME",
        "label": {
          "en": "Montenegro",
          "ar": "الجبل الأسود"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "XK",
        "label": {
          "en": "Kosovo",
          "ar": "كوسوفو"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "ZA",
        "label": {
          "en": "South Africa",
          "ar": "جنوب أفريقيا"
        }
      },
      {
        "countryCode": "AR",
        "label": {
          "en": "Argentina",
          "ar": "الأرجنتين"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "meat",
      "balkans"
    ],
    "similarityGroup": "food_new_pljeskavica_rs",
    "distractorNearCodes": [
      "BA",
      "HR",
      "MK",
      "BG",
      "RO",
      "AL",
      "SI",
      "ME",
      "GR",
      "XK"
    ],
    "distractorFarCodes": [
      "TR",
      "DE",
      "EG",
      "SA",
      "BR",
      "US",
      "IN",
      "FR",
      "ZA",
      "AR"
    ]
  },
  {
    "id": "food_new_pom_sr",
    "answer": "SR",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Pom",
      "ar": "بوم"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_pom_sr.jpeg",
    "imageAlt": "Pom food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "SR",
        "label": {
          "en": "Suriname",
          "ar": "سورينام"
        }
      },
      {
        "countryCode": "GY",
        "label": {
          "en": "Guyana",
          "ar": "غيانا"
        }
      },
      {
        "countryCode": "VE",
        "label": {
          "en": "Venezuela",
          "ar": "فنزويلا"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "TT",
        "label": {
          "en": "Trinidad & Tobago",
          "ar": "ترينيداد وتوباغو"
        }
      },
      {
        "countryCode": "JM",
        "label": {
          "en": "Jamaica",
          "ar": "جامايكا"
        }
      },
      {
        "countryCode": "HT",
        "label": {
          "en": "Haiti",
          "ar": "هايتي"
        }
      },
      {
        "countryCode": "DO",
        "label": {
          "en": "Dominican Republic",
          "ar": "جمهورية الدومينيكان"
        }
      },
      {
        "countryCode": "CU",
        "label": {
          "en": "Cuba",
          "ar": "كوبا"
        }
      },
      {
        "countryCode": "BS",
        "label": {
          "en": "Bahamas",
          "ar": "جزر البهاما"
        }
      },
      {
        "countryCode": "BB",
        "label": {
          "en": "Barbados",
          "ar": "بربادوس"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "caribbean"
    ],
    "similarityGroup": "food_new_pom_sr",
    "distractorNearCodes": [
      "GY",
      "VE",
      "BR",
      "TT",
      "JM",
      "HT",
      "DO",
      "CU",
      "BS",
      "BB"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA"
    ]
  },
  {
    "id": "food_new_potjiekos_za",
    "answer": "ZA",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Potjiekos",
      "ar": "بوتجيكوس"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_potjiekos_za.jpeg",
    "imageAlt": "Potjiekos food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "ZA",
        "label": {
          "en": "South Africa",
          "ar": "جنوب أفريقيا"
        }
      },
      {
        "countryCode": "BW",
        "label": {
          "en": "Botswana",
          "ar": "بوتسوانا"
        }
      },
      {
        "countryCode": "ZM",
        "label": {
          "en": "Zambia",
          "ar": "زامبيا"
        }
      },
      {
        "countryCode": "ZW",
        "label": {
          "en": "Zimbabwe",
          "ar": "زيمبابوي"
        }
      },
      {
        "countryCode": "MZ",
        "label": {
          "en": "Mozambique",
          "ar": "موزمبيق"
        }
      },
      {
        "countryCode": "NA",
        "label": {
          "en": "Namibia",
          "ar": "ناميبيا"
        }
      },
      {
        "countryCode": "LS",
        "label": {
          "en": "Lesotho",
          "ar": "ليسوتو"
        }
      },
      {
        "countryCode": "SZ",
        "label": {
          "en": "Eswatini",
          "ar": "إسواتيني"
        }
      },
      {
        "countryCode": "MW",
        "label": {
          "en": "Malawi",
          "ar": "ملاوي"
        }
      },
      {
        "countryCode": "AO",
        "label": {
          "en": "Angola",
          "ar": "أنغولا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "southern_africa"
    ],
    "similarityGroup": "food_new_potjiekos_za",
    "distractorNearCodes": [
      "BW",
      "ZM",
      "ZW",
      "MZ",
      "NA",
      "LS",
      "SZ",
      "MW",
      "AO"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA"
    ]
  },
  {
    "id": "food_new_qurutob_tj",
    "answer": "TJ",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Qurutob",
      "ar": "قوروتوب"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_qurutob_tj.jpeg",
    "imageAlt": "Qurutob food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "TJ",
        "label": {
          "en": "Tajikistan",
          "ar": "طاجيكستان"
        }
      },
      {
        "countryCode": "UZ",
        "label": {
          "en": "Uzbekistan",
          "ar": "أوزبكستان"
        }
      },
      {
        "countryCode": "KG",
        "label": {
          "en": "Kyrgyzstan",
          "ar": "قيرغيزستان"
        }
      },
      {
        "countryCode": "AF",
        "label": {
          "en": "Afghanistan",
          "ar": "أفغانستان"
        }
      },
      {
        "countryCode": "TM",
        "label": {
          "en": "Turkmenistan",
          "ar": "تركمانستان"
        }
      },
      {
        "countryCode": "KZ",
        "label": {
          "en": "Kazakhstan",
          "ar": "كازاخستان"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "GE",
        "label": {
          "en": "Georgia",
          "ar": "جورجيا"
        }
      },
      {
        "countryCode": "AM",
        "label": {
          "en": "Armenia",
          "ar": "أرمينيا"
        }
      },
      {
        "countryCode": "AZ",
        "label": {
          "en": "Azerbaijan",
          "ar": "أذربيجان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "MX",
        "label": {
          "en": "Mexico",
          "ar": "المكسيك"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "snack",
      "central_asia"
    ],
    "similarityGroup": "food_new_qurutob_tj",
    "distractorNearCodes": [
      "UZ",
      "KG",
      "AF",
      "TM",
      "KZ",
      "IR",
      "GE",
      "AM",
      "AZ",
      "TR"
    ],
    "distractorFarCodes": [
      "IN",
      "MX",
      "TH",
      "EG",
      "FR",
      "IT",
      "JP",
      "BR",
      "CN",
      "ES"
    ]
  },
  {
    "id": "food_new_ragu_alla_bolognese_it",
    "answer": "IT",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Ragù alla Bolognese",
      "ar": "راجو بولونيز"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_ragu_alla_bolognese_it.jpeg",
    "imageAlt": "Ragù alla Bolognese food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "CH",
        "label": {
          "en": "Switzerland",
          "ar": "سويسرا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "MT",
        "label": {
          "en": "Malta",
          "ar": "مالطا"
        }
      },
      {
        "countryCode": "PT",
        "label": {
          "en": "Portugal",
          "ar": "البرتغال"
        }
      },
      {
        "countryCode": "CY",
        "label": {
          "en": "Cyprus",
          "ar": "قبرص"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "HR",
        "label": {
          "en": "Croatia",
          "ar": "كرواتيا"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "MX",
        "label": {
          "en": "Mexico",
          "ar": "المكسيك"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "pasta",
      "med_europe"
    ],
    "similarityGroup": "food_new_ragu_alla_bolognese_it",
    "distractorNearCodes": [
      "FR",
      "CH",
      "ES",
      "GR",
      "MT",
      "PT",
      "CY",
      "TR",
      "HR"
    ],
    "distractorFarCodes": [
      "US",
      "CN",
      "JP",
      "DE",
      "GB",
      "EG",
      "IN",
      "KR",
      "MX",
      "BR"
    ]
  },
  {
    "id": "food_new_rosolje_ee",
    "answer": "EE",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Rosolje",
      "ar": "روسولييه"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_rosolje_ee.jpeg",
    "imageAlt": "Rosolje food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "EE",
        "label": {
          "en": "Estonia",
          "ar": "إستونيا"
        }
      },
      {
        "countryCode": "LV",
        "label": {
          "en": "Latvia",
          "ar": "لاتفيا"
        }
      },
      {
        "countryCode": "LT",
        "label": {
          "en": "Lithuania",
          "ar": "ليتوانيا"
        }
      },
      {
        "countryCode": "FI",
        "label": {
          "en": "Finland",
          "ar": "فنلندا"
        }
      },
      {
        "countryCode": "RU",
        "label": {
          "en": "Russia",
          "ar": "روسيا"
        }
      },
      {
        "countryCode": "SE",
        "label": {
          "en": "Sweden",
          "ar": "السويد"
        }
      },
      {
        "countryCode": "PL",
        "label": {
          "en": "Poland",
          "ar": "بولندا"
        }
      },
      {
        "countryCode": "UA",
        "label": {
          "en": "Ukraine",
          "ar": "أوكرانيا"
        }
      },
      {
        "countryCode": "BY",
        "label": {
          "en": "Belarus",
          "ar": "بيلاروسيا"
        }
      },
      {
        "countryCode": "SK",
        "label": {
          "en": "Slovakia",
          "ar": "سلوفاكيا"
        }
      },
      {
        "countryCode": "CZ",
        "label": {
          "en": "Czechia",
          "ar": "التشيك"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "salad",
      "east_europe"
    ],
    "similarityGroup": "food_new_rosolje_ee",
    "distractorNearCodes": [
      "LV",
      "LT",
      "FI",
      "RU",
      "SE",
      "PL",
      "UA",
      "BY",
      "SK",
      "CZ"
    ],
    "distractorFarCodes": [
      "EG",
      "GR",
      "IT",
      "TR",
      "FR",
      "DE",
      "ES",
      "GB",
      "US",
      "IN"
    ]
  },
  {
    "id": "food_new_rosti_ch",
    "answer": "CH",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Rösti",
      "ar": "روستي"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_rosti_ch.jpeg",
    "imageAlt": "Rösti food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "CH",
        "label": {
          "en": "Switzerland",
          "ar": "سويسرا"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "BE",
        "label": {
          "en": "Belgium",
          "ar": "بلجيكا"
        }
      },
      {
        "countryCode": "NL",
        "label": {
          "en": "Netherlands",
          "ar": "هولندا"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "IE",
        "label": {
          "en": "Ireland",
          "ar": "أيرلندا"
        }
      },
      {
        "countryCode": "LU",
        "label": {
          "en": "Luxembourg",
          "ar": "لوكسمبورغ"
        }
      },
      {
        "countryCode": "AT",
        "label": {
          "en": "Austria",
          "ar": "النمسا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "MX",
        "label": {
          "en": "Mexico",
          "ar": "المكسيك"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "snack",
      "western_europe"
    ],
    "similarityGroup": "food_new_rosti_ch",
    "distractorNearCodes": [
      "FR",
      "DE",
      "BE",
      "NL",
      "GB",
      "IE",
      "LU",
      "AT"
    ],
    "distractorFarCodes": [
      "IN",
      "TR",
      "MX",
      "TH",
      "EG",
      "IT",
      "JP",
      "BR",
      "CN",
      "ES"
    ]
  },
  {
    "id": "food_new_saltenas_bo",
    "answer": "BO",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Salteñas",
      "ar": "سالتيناس"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_saltenas_bo.jpg",
    "imageAlt": "Salteñas food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "BO",
        "label": {
          "en": "Bolivia",
          "ar": "بوليفيا"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "AR",
        "label": {
          "en": "Argentina",
          "ar": "الأرجنتين"
        }
      },
      {
        "countryCode": "UY",
        "label": {
          "en": "Uruguay",
          "ar": "أورغواي"
        }
      },
      {
        "countryCode": "PY",
        "label": {
          "en": "Paraguay",
          "ar": "باراغواي"
        }
      },
      {
        "countryCode": "CL",
        "label": {
          "en": "Chile",
          "ar": "تشيلي"
        }
      },
      {
        "countryCode": "PE",
        "label": {
          "en": "Peru",
          "ar": "بيرو"
        }
      },
      {
        "countryCode": "EC",
        "label": {
          "en": "Ecuador",
          "ar": "الإكوادور"
        }
      },
      {
        "countryCode": "CO",
        "label": {
          "en": "Colombia",
          "ar": "كولومبيا"
        }
      },
      {
        "countryCode": "VE",
        "label": {
          "en": "Venezuela",
          "ar": "فنزويلا"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "PT",
        "label": {
          "en": "Portugal",
          "ar": "البرتغال"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "DZ",
        "label": {
          "en": "Algeria",
          "ar": "الجزائر"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "pastry",
      "latam_south"
    ],
    "similarityGroup": "food_new_saltenas_bo",
    "distractorNearCodes": [
      "BR",
      "AR",
      "UY",
      "PY",
      "CL",
      "PE",
      "EC",
      "CO",
      "VE"
    ],
    "distractorFarCodes": [
      "FR",
      "TR",
      "IT",
      "GR",
      "EG",
      "IN",
      "ES",
      "PT",
      "MA",
      "DZ"
    ]
  },
  {
    "id": "food_new_sauerbraten_de",
    "answer": "DE",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Sauerbraten",
      "ar": "ساوربراتن"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_sauerbraten_de.jpeg",
    "imageAlt": "Sauerbraten food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "BE",
        "label": {
          "en": "Belgium",
          "ar": "بلجيكا"
        }
      },
      {
        "countryCode": "NL",
        "label": {
          "en": "Netherlands",
          "ar": "هولندا"
        }
      },
      {
        "countryCode": "CH",
        "label": {
          "en": "Switzerland",
          "ar": "سويسرا"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "IE",
        "label": {
          "en": "Ireland",
          "ar": "أيرلندا"
        }
      },
      {
        "countryCode": "LU",
        "label": {
          "en": "Luxembourg",
          "ar": "لوكسمبورغ"
        }
      },
      {
        "countryCode": "AT",
        "label": {
          "en": "Austria",
          "ar": "النمسا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "ZA",
        "label": {
          "en": "South Africa",
          "ar": "جنوب أفريقيا"
        }
      },
      {
        "countryCode": "AR",
        "label": {
          "en": "Argentina",
          "ar": "الأرجنتين"
        }
      },
      {
        "countryCode": "MX",
        "label": {
          "en": "Mexico",
          "ar": "المكسيك"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "meat",
      "western_europe"
    ],
    "similarityGroup": "food_new_sauerbraten_de",
    "distractorNearCodes": [
      "FR",
      "BE",
      "NL",
      "CH",
      "GB",
      "IE",
      "LU",
      "AT"
    ],
    "distractorFarCodes": [
      "TR",
      "GR",
      "EG",
      "SA",
      "BR",
      "US",
      "IN",
      "ZA",
      "AR",
      "MX"
    ]
  },
  {
    "id": "food_new_wiener_schnitzel_at",
    "answer": "AT",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Wiener Schnitzel",
      "ar": "شنيتزل فيينا"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_wiener_schnitzel_at.jpeg",
    "imageAlt": "Wiener Schnitzel food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "AT",
        "label": {
          "en": "Austria",
          "ar": "النمسا"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "BE",
        "label": {
          "en": "Belgium",
          "ar": "بلجيكا"
        }
      },
      {
        "countryCode": "NL",
        "label": {
          "en": "Netherlands",
          "ar": "هولندا"
        }
      },
      {
        "countryCode": "CH",
        "label": {
          "en": "Switzerland",
          "ar": "سويسرا"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "IE",
        "label": {
          "en": "Ireland",
          "ar": "أيرلندا"
        }
      },
      {
        "countryCode": "LU",
        "label": {
          "en": "Luxembourg",
          "ar": "لوكسمبورغ"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "ZA",
        "label": {
          "en": "South Africa",
          "ar": "جنوب أفريقيا"
        }
      },
      {
        "countryCode": "AR",
        "label": {
          "en": "Argentina",
          "ar": "الأرجنتين"
        }
      },
      {
        "countryCode": "MX",
        "label": {
          "en": "Mexico",
          "ar": "المكسيك"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "meat",
      "western_europe"
    ],
    "similarityGroup": "food_new_wiener_schnitzel_at",
    "distractorNearCodes": [
      "FR",
      "DE",
      "BE",
      "NL",
      "CH",
      "GB",
      "IE",
      "LU"
    ],
    "distractorFarCodes": [
      "TR",
      "GR",
      "EG",
      "SA",
      "BR",
      "US",
      "IN",
      "ZA",
      "AR",
      "MX"
    ]
  },
  {
    "id": "food_new_seswaa_bw",
    "answer": "BW",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Seswaa",
      "ar": "سيسوا"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_seswaa_bw.jpeg",
    "imageAlt": "Seswaa food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "BW",
        "label": {
          "en": "Botswana",
          "ar": "بوتسوانا"
        }
      },
      {
        "countryCode": "ZA",
        "label": {
          "en": "South Africa",
          "ar": "جنوب أفريقيا"
        }
      },
      {
        "countryCode": "NA",
        "label": {
          "en": "Namibia",
          "ar": "ناميبيا"
        }
      },
      {
        "countryCode": "ZM",
        "label": {
          "en": "Zambia",
          "ar": "زامبيا"
        }
      },
      {
        "countryCode": "ZW",
        "label": {
          "en": "Zimbabwe",
          "ar": "زيمبابوي"
        }
      },
      {
        "countryCode": "LS",
        "label": {
          "en": "Lesotho",
          "ar": "ليسوتو"
        }
      },
      {
        "countryCode": "SZ",
        "label": {
          "en": "Eswatini",
          "ar": "إسواتيني"
        }
      },
      {
        "countryCode": "MW",
        "label": {
          "en": "Malawi",
          "ar": "ملاوي"
        }
      },
      {
        "countryCode": "MZ",
        "label": {
          "en": "Mozambique",
          "ar": "موزمبيق"
        }
      },
      {
        "countryCode": "AO",
        "label": {
          "en": "Angola",
          "ar": "أنغولا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "AR",
        "label": {
          "en": "Argentina",
          "ar": "الأرجنتين"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "meat",
      "southern_africa"
    ],
    "similarityGroup": "food_new_seswaa_bw",
    "distractorNearCodes": [
      "ZA",
      "NA",
      "ZM",
      "ZW",
      "LS",
      "SZ",
      "MW",
      "MZ",
      "AO"
    ],
    "distractorFarCodes": [
      "TR",
      "DE",
      "GR",
      "EG",
      "SA",
      "BR",
      "US",
      "IN",
      "FR",
      "AR"
    ]
  },
  {
    "id": "food_new_shchi_ru",
    "answer": "RU",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Shchi",
      "ar": "شي شوربة روسية"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_shchi_ru.jpeg",
    "imageAlt": "Shchi food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "RU",
        "label": {
          "en": "Russia",
          "ar": "روسيا"
        }
      },
      {
        "countryCode": "PL",
        "label": {
          "en": "Poland",
          "ar": "بولندا"
        }
      },
      {
        "countryCode": "UA",
        "label": {
          "en": "Ukraine",
          "ar": "أوكرانيا"
        }
      },
      {
        "countryCode": "BY",
        "label": {
          "en": "Belarus",
          "ar": "بيلاروسيا"
        }
      },
      {
        "countryCode": "SK",
        "label": {
          "en": "Slovakia",
          "ar": "سلوفاكيا"
        }
      },
      {
        "countryCode": "CZ",
        "label": {
          "en": "Czechia",
          "ar": "التشيك"
        }
      },
      {
        "countryCode": "HU",
        "label": {
          "en": "Hungary",
          "ar": "هنغاريا"
        }
      },
      {
        "countryCode": "RO",
        "label": {
          "en": "Romania",
          "ar": "رومانيا"
        }
      },
      {
        "countryCode": "LT",
        "label": {
          "en": "Lithuania",
          "ar": "ليتوانيا"
        }
      },
      {
        "countryCode": "LV",
        "label": {
          "en": "Latvia",
          "ar": "لاتفيا"
        }
      },
      {
        "countryCode": "EE",
        "label": {
          "en": "Estonia",
          "ar": "إستونيا"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "soup",
      "east_europe"
    ],
    "similarityGroup": "food_new_shchi_ru",
    "distractorNearCodes": [
      "PL",
      "UA",
      "BY",
      "SK",
      "CZ",
      "HU",
      "RO",
      "LT",
      "LV",
      "EE"
    ],
    "distractorFarCodes": [
      "VN",
      "CN",
      "TR",
      "JP",
      "EG",
      "IN",
      "FR",
      "IT",
      "TH",
      "KR"
    ]
  },
  {
    "id": "food_new_skoudehkaris_dj",
    "answer": "DJ",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Skoudehkaris",
      "ar": "سكوديكاريس"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_skoudehkaris_dj.jpeg",
    "imageAlt": "Skoudehkaris food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "DJ",
        "label": {
          "en": "Djibouti",
          "ar": "جيبوتي"
        }
      },
      {
        "countryCode": "SO",
        "label": {
          "en": "Somalia",
          "ar": "الصومال"
        }
      },
      {
        "countryCode": "ET",
        "label": {
          "en": "Ethiopia",
          "ar": "إثيوبيا"
        }
      },
      {
        "countryCode": "ER",
        "label": {
          "en": "Eritrea",
          "ar": "إريتريا"
        }
      },
      {
        "countryCode": "KE",
        "label": {
          "en": "Kenya",
          "ar": "كينيا"
        }
      },
      {
        "countryCode": "SD",
        "label": {
          "en": "Sudan",
          "ar": "السودان"
        }
      },
      {
        "countryCode": "TZ",
        "label": {
          "en": "Tanzania",
          "ar": "تنزانيا"
        }
      },
      {
        "countryCode": "UG",
        "label": {
          "en": "Uganda",
          "ar": "أوغندا"
        }
      },
      {
        "countryCode": "RW",
        "label": {
          "en": "Rwanda",
          "ar": "رواندا"
        }
      },
      {
        "countryCode": "BI",
        "label": {
          "en": "Burundi",
          "ar": "بوروندي"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "ID",
        "label": {
          "en": "Indonesia",
          "ar": "إندونيسيا"
        }
      },
      {
        "countryCode": "MY",
        "label": {
          "en": "Malaysia",
          "ar": "ماليزيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "rice",
      "east_africa"
    ],
    "similarityGroup": "food_new_skoudehkaris_dj",
    "distractorNearCodes": [
      "SO",
      "ET",
      "ER",
      "KE",
      "SD",
      "TZ",
      "UG",
      "RW",
      "BI"
    ],
    "distractorFarCodes": [
      "IN",
      "PK",
      "TR",
      "SA",
      "EG",
      "ID",
      "MY",
      "JP",
      "CN",
      "TH"
    ]
  },
  {
    "id": "food_new_snkapur_am",
    "answer": "AM",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Snkapur",
      "ar": "سنكابور"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_snkapur_am.jpeg",
    "imageAlt": "Snkapur food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "AM",
        "label": {
          "en": "Armenia",
          "ar": "أرمينيا"
        }
      },
      {
        "countryCode": "GE",
        "label": {
          "en": "Georgia",
          "ar": "جورجيا"
        }
      },
      {
        "countryCode": "AZ",
        "label": {
          "en": "Azerbaijan",
          "ar": "أذربيجان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "RU",
        "label": {
          "en": "Russia",
          "ar": "روسيا"
        }
      },
      {
        "countryCode": "UZ",
        "label": {
          "en": "Uzbekistan",
          "ar": "أوزبكستان"
        }
      },
      {
        "countryCode": "KG",
        "label": {
          "en": "Kyrgyzstan",
          "ar": "قيرغيزستان"
        }
      },
      {
        "countryCode": "TJ",
        "label": {
          "en": "Tajikistan",
          "ar": "طاجيكستان"
        }
      },
      {
        "countryCode": "TM",
        "label": {
          "en": "Turkmenistan",
          "ar": "تركمانستان"
        }
      },
      {
        "countryCode": "KZ",
        "label": {
          "en": "Kazakhstan",
          "ar": "كازاخستان"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "soup",
      "caucasus"
    ],
    "similarityGroup": "food_new_snkapur_am",
    "distractorNearCodes": [
      "GE",
      "AZ",
      "TR",
      "IR",
      "RU",
      "UZ",
      "KG",
      "TJ",
      "TM",
      "KZ"
    ],
    "distractorFarCodes": [
      "VN",
      "CN",
      "JP",
      "EG",
      "IN",
      "FR",
      "IT",
      "TH",
      "KR",
      "ES"
    ]
  },
  {
    "id": "food_new_sopa_paraguaya_py",
    "answer": "PY",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Cornbread",
      "ar": "خبز الذرة"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_sopa_paraguaya_py.jpeg",
    "imageAlt": "Sopa Paraguaya food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "PY",
        "label": {
          "en": "Paraguay",
          "ar": "باراغواي"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "AR",
        "label": {
          "en": "Argentina",
          "ar": "الأرجنتين"
        }
      },
      {
        "countryCode": "UY",
        "label": {
          "en": "Uruguay",
          "ar": "أورغواي"
        }
      },
      {
        "countryCode": "BO",
        "label": {
          "en": "Bolivia",
          "ar": "بوليفيا"
        }
      },
      {
        "countryCode": "CL",
        "label": {
          "en": "Chile",
          "ar": "تشيلي"
        }
      },
      {
        "countryCode": "PE",
        "label": {
          "en": "Peru",
          "ar": "بيرو"
        }
      },
      {
        "countryCode": "EC",
        "label": {
          "en": "Ecuador",
          "ar": "الإكوادور"
        }
      },
      {
        "countryCode": "CO",
        "label": {
          "en": "Colombia",
          "ar": "كولومبيا"
        }
      },
      {
        "countryCode": "VE",
        "label": {
          "en": "Venezuela",
          "ar": "فنزويلا"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "PT",
        "label": {
          "en": "Portugal",
          "ar": "البرتغال"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "DZ",
        "label": {
          "en": "Algeria",
          "ar": "الجزائر"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "pastry",
      "latam_south"
    ],
    "similarityGroup": "food_new_sopa_paraguaya_py",
    "distractorNearCodes": [
      "BR",
      "AR",
      "UY",
      "BO",
      "CL",
      "PE",
      "EC",
      "CO",
      "VE"
    ],
    "distractorFarCodes": [
      "FR",
      "TR",
      "IT",
      "GR",
      "EG",
      "IN",
      "ES",
      "PT",
      "MA",
      "DZ"
    ]
  },
  {
    "id": "food_new_stamppot_nl",
    "answer": "NL",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Stamppot",
      "ar": "ستامبوت"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_stamppot_nl.jpeg",
    "imageAlt": "Stamppot food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "NL",
        "label": {
          "en": "Netherlands",
          "ar": "هولندا"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "BE",
        "label": {
          "en": "Belgium",
          "ar": "بلجيكا"
        }
      },
      {
        "countryCode": "CH",
        "label": {
          "en": "Switzerland",
          "ar": "سويسرا"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "IE",
        "label": {
          "en": "Ireland",
          "ar": "أيرلندا"
        }
      },
      {
        "countryCode": "LU",
        "label": {
          "en": "Luxembourg",
          "ar": "لوكسمبورغ"
        }
      },
      {
        "countryCode": "AT",
        "label": {
          "en": "Austria",
          "ar": "النمسا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      }
    ],
    "category": "food",
    "difficulty": "medium",
    "tags": [
      "vegetables",
      "western_europe"
    ],
    "similarityGroup": "food_new_stamppot_nl",
    "distractorNearCodes": [
      "FR",
      "DE",
      "BE",
      "CH",
      "GB",
      "IE",
      "LU",
      "AT"
    ],
    "distractorFarCodes": [
      "EG",
      "IN",
      "TR",
      "GR",
      "IT",
      "CN",
      "KR",
      "JP",
      "TH",
      "MA"
    ]
  },
  {
    "id": "food_new_tave_kosi_al",
    "answer": "AL",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Tavë Kosi",
      "ar": "تافي كوسي"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_tave_kosi_al.jpeg",
    "imageAlt": "Tavë Kosi food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "AL",
        "label": {
          "en": "Albania",
          "ar": "ألبانيا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "MK",
        "label": {
          "en": "North Macedonia",
          "ar": "مقدونيا الشمالية"
        }
      },
      {
        "countryCode": "RS",
        "label": {
          "en": "Serbia",
          "ar": "صربيا"
        }
      },
      {
        "countryCode": "ME",
        "label": {
          "en": "Montenegro",
          "ar": "الجبل الأسود"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "BA",
        "label": {
          "en": "Bosnia & Herzegovina",
          "ar": "البوسنة والهرسك"
        }
      },
      {
        "countryCode": "HR",
        "label": {
          "en": "Croatia",
          "ar": "كرواتيا"
        }
      },
      {
        "countryCode": "SI",
        "label": {
          "en": "Slovenia",
          "ar": "سلوفينيا"
        }
      },
      {
        "countryCode": "BG",
        "label": {
          "en": "Bulgaria",
          "ar": "بلغاريا"
        }
      },
      {
        "countryCode": "RO",
        "label": {
          "en": "Romania",
          "ar": "رومانيا"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "DE",
        "label": {
          "en": "Germany",
          "ar": "ألمانيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "BR",
        "label": {
          "en": "Brazil",
          "ar": "البرازيل"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "ZA",
        "label": {
          "en": "South Africa",
          "ar": "جنوب أفريقيا"
        }
      },
      {
        "countryCode": "AR",
        "label": {
          "en": "Argentina",
          "ar": "الأرجنتين"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "meat",
      "balkans"
    ],
    "similarityGroup": "food_new_tave_kosi_al",
    "distractorNearCodes": [
      "GR",
      "MK",
      "RS",
      "ME",
      "IT",
      "BA",
      "HR",
      "SI",
      "BG",
      "RO"
    ],
    "distractorFarCodes": [
      "TR",
      "DE",
      "EG",
      "SA",
      "BR",
      "US",
      "IN",
      "FR",
      "ZA",
      "AR"
    ]
  },
  {
    "id": "food_new_thieboudienne_sn",
    "answer": "SN",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Thiéboudienne",
      "ar": "تيبوديين"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_thieboudienne_sn.jpeg",
    "imageAlt": "Thiéboudienne food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "SN",
        "label": {
          "en": "Senegal",
          "ar": "السنغال"
        }
      },
      {
        "countryCode": "NG",
        "label": {
          "en": "Nigeria",
          "ar": "نيجيريا"
        }
      },
      {
        "countryCode": "GH",
        "label": {
          "en": "Ghana",
          "ar": "غانا"
        }
      },
      {
        "countryCode": "GM",
        "label": {
          "en": "Gambia",
          "ar": "غامبيا"
        }
      },
      {
        "countryCode": "CI",
        "label": {
          "en": "Côte d’Ivoire",
          "ar": "ساحل العاج"
        }
      },
      {
        "countryCode": "TG",
        "label": {
          "en": "Togo",
          "ar": "توغو"
        }
      },
      {
        "countryCode": "BJ",
        "label": {
          "en": "Benin",
          "ar": "بنين"
        }
      },
      {
        "countryCode": "GN",
        "label": {
          "en": "Guinea",
          "ar": "غينيا"
        }
      },
      {
        "countryCode": "GW",
        "label": {
          "en": "Guinea-Bissau",
          "ar": "غينيا بيساو"
        }
      },
      {
        "countryCode": "NE",
        "label": {
          "en": "Niger",
          "ar": "النيجر"
        }
      },
      {
        "countryCode": "ML",
        "label": {
          "en": "Mali",
          "ar": "مالي"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "ID",
        "label": {
          "en": "Indonesia",
          "ar": "إندونيسيا"
        }
      },
      {
        "countryCode": "MY",
        "label": {
          "en": "Malaysia",
          "ar": "ماليزيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "rice",
      "west_africa"
    ],
    "similarityGroup": "food_new_thieboudienne_sn",
    "distractorNearCodes": [
      "NG",
      "GH",
      "GM",
      "CI",
      "TG",
      "BJ",
      "GN",
      "GW",
      "NE",
      "ML"
    ],
    "distractorFarCodes": [
      "IN",
      "PK",
      "TR",
      "SA",
      "EG",
      "ID",
      "MY",
      "JP",
      "CN",
      "TH"
    ]
  },
  {
    "id": "food_new_fish_amok_trey_amok_kh",
    "answer": "KH",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Fish Amok",
      "ar": "سمك أموك"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_fish_amok_trey_amok_kh.jpeg",
    "imageAlt": "Fish Amok (Trey Amok) food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "KH",
        "label": {
          "en": "Cambodia",
          "ar": "كمبوديا"
        }
      },
      {
        "countryCode": "PH",
        "label": {
          "en": "Philippines",
          "ar": "الفلبين"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "ID",
        "label": {
          "en": "Indonesia",
          "ar": "إندونيسيا"
        }
      },
      {
        "countryCode": "MY",
        "label": {
          "en": "Malaysia",
          "ar": "ماليزيا"
        }
      },
      {
        "countryCode": "SG",
        "label": {
          "en": "Singapore",
          "ar": "سنغافورة"
        }
      },
      {
        "countryCode": "LA",
        "label": {
          "en": "Laos",
          "ar": "لاوس"
        }
      },
      {
        "countryCode": "MM",
        "label": {
          "en": "Myanmar (Burma)",
          "ar": "ميانمار (بورما)"
        }
      },
      {
        "countryCode": "BN",
        "label": {
          "en": "Brunei",
          "ar": "بروناي"
        }
      },
      {
        "countryCode": "TL",
        "label": {
          "en": "Timor-Leste",
          "ar": "تيمور الشرقية"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "ES",
        "label": {
          "en": "Spain",
          "ar": "إسبانيا"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "PT",
        "label": {
          "en": "Portugal",
          "ar": "البرتغال"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      },
      {
        "countryCode": "GB",
        "label": {
          "en": "United Kingdom",
          "ar": "بريطانيا"
        }
      },
      {
        "countryCode": "US",
        "label": {
          "en": "United States",
          "ar": "أمريكا"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "seafood",
      "southeast_asia"
    ],
    "similarityGroup": "food_new_fish_amok_trey_amok_kh",
    "distractorNearCodes": [
      "PH",
      "TH",
      "VN",
      "ID",
      "MY",
      "SG",
      "LA",
      "MM",
      "BN",
      "TL"
    ],
    "distractorFarCodes": [
      "JP",
      "GR",
      "IT",
      "ES",
      "FR",
      "EG",
      "PT",
      "KR",
      "GB",
      "US"
    ]
  },
  {
    "id": "food_new_zeama_md",
    "answer": "MD",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Zeamă",
      "ar": "زياما"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_zeama_md.jpeg",
    "imageAlt": "Zeamă food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "MD",
        "label": {
          "en": "Moldova",
          "ar": "مولدوفا"
        }
      },
      {
        "countryCode": "UA",
        "label": {
          "en": "Ukraine",
          "ar": "أوكرانيا"
        }
      },
      {
        "countryCode": "RO",
        "label": {
          "en": "Romania",
          "ar": "رومانيا"
        }
      },
      {
        "countryCode": "RU",
        "label": {
          "en": "Russia",
          "ar": "روسيا"
        }
      },
      {
        "countryCode": "BG",
        "label": {
          "en": "Bulgaria",
          "ar": "بلغاريا"
        }
      },
      {
        "countryCode": "PL",
        "label": {
          "en": "Poland",
          "ar": "بولندا"
        }
      },
      {
        "countryCode": "BY",
        "label": {
          "en": "Belarus",
          "ar": "بيلاروسيا"
        }
      },
      {
        "countryCode": "SK",
        "label": {
          "en": "Slovakia",
          "ar": "سلوفاكيا"
        }
      },
      {
        "countryCode": "CZ",
        "label": {
          "en": "Czechia",
          "ar": "التشيك"
        }
      },
      {
        "countryCode": "HU",
        "label": {
          "en": "Hungary",
          "ar": "هنغاريا"
        }
      },
      {
        "countryCode": "LT",
        "label": {
          "en": "Lithuania",
          "ar": "ليتوانيا"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "soup",
      "east_europe"
    ],
    "similarityGroup": "food_new_zeama_md",
    "distractorNearCodes": [
      "UA",
      "RO",
      "RU",
      "BG",
      "PL",
      "BY",
      "SK",
      "CZ",
      "HU",
      "LT"
    ],
    "distractorFarCodes": [
      "VN",
      "CN",
      "TR",
      "JP",
      "EG",
      "IN",
      "FR",
      "IT",
      "TH",
      "KR"
    ]
  },
  {
    "id": "food_new_kuku_wa_kupaka_ke",
    "answer": "KE",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Kuku wa Kupaka",
      "ar": "كوكو وا كوبّاكا"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_kuku_wa_kupaka_ke.jpeg",
    "imageAlt": "Kuku wa Kupaka food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "KE",
        "label": {
          "en": "Kenya",
          "ar": "كينيا"
        }
      },
      {
        "countryCode": "TZ",
        "label": {
          "en": "Tanzania",
          "ar": "تنزانيا"
        }
      },
      {
        "countryCode": "UG",
        "label": {
          "en": "Uganda",
          "ar": "أوغندا"
        }
      },
      {
        "countryCode": "RW",
        "label": {
          "en": "Rwanda",
          "ar": "رواندا"
        }
      },
      {
        "countryCode": "BI",
        "label": {
          "en": "Burundi",
          "ar": "بوروندي"
        }
      },
      {
        "countryCode": "SO",
        "label": {
          "en": "Somalia",
          "ar": "الصومال"
        }
      },
      {
        "countryCode": "DJ",
        "label": {
          "en": "Djibouti",
          "ar": "جيبوتي"
        }
      },
      {
        "countryCode": "ET",
        "label": {
          "en": "Ethiopia",
          "ar": "إثيوبيا"
        }
      },
      {
        "countryCode": "ER",
        "label": {
          "en": "Eritrea",
          "ar": "إريتريا"
        }
      },
      {
        "countryCode": "SD",
        "label": {
          "en": "Sudan",
          "ar": "السودان"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "MA",
        "label": {
          "en": "Morocco",
          "ar": "المغرب"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "IR",
        "label": {
          "en": "Iran",
          "ar": "إيران"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "GR",
        "label": {
          "en": "Greece",
          "ar": "اليونان"
        }
      },
      {
        "countryCode": "YE",
        "label": {
          "en": "Yemen",
          "ar": "اليمن"
        }
      },
      {
        "countryCode": "PK",
        "label": {
          "en": "Pakistan",
          "ar": "باكستان"
        }
      },
      {
        "countryCode": "SA",
        "label": {
          "en": "Saudi Arabia",
          "ar": "المملكة العربية السعودية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "stew",
      "east_africa"
    ],
    "similarityGroup": "food_new_kuku_wa_kupaka_ke",
    "distractorNearCodes": [
      "TZ",
      "UG",
      "RW",
      "BI",
      "SO",
      "DJ",
      "ET",
      "ER",
      "SD"
    ],
    "distractorFarCodes": [
      "TR",
      "EG",
      "MA",
      "IN",
      "IR",
      "FR",
      "GR",
      "YE",
      "PK",
      "SA"
    ]
  },
  {
    "id": "food_new_saltibarsciai_lt",
    "answer": "LT",
    "statement": {
      "en": "Which country is this dish associated with?",
      "ar": "الطبق ده مشهور في مطبخ أنهي بلد؟"
    },
    "dishName": {
      "en": "Šaltibarščiai",
      "ar": "شالتيبارشتشاي"
    },
    "imageLabel": "🍽️",
    "imageUrl": "/assets/game/runtime/minigames/food-origin/photos/food_new_saltibarsciai_lt.jpeg",
    "imageAlt": "Šaltibarščiai food photo",
    "sourceName": "User-uploaded dishes.zip (editorial classification)",
    "sourceUrl": null,
    "choices": [
      {
        "countryCode": "LT",
        "label": {
          "en": "Lithuania",
          "ar": "ليتوانيا"
        }
      },
      {
        "countryCode": "LV",
        "label": {
          "en": "Latvia",
          "ar": "لاتفيا"
        }
      },
      {
        "countryCode": "EE",
        "label": {
          "en": "Estonia",
          "ar": "إستونيا"
        }
      },
      {
        "countryCode": "PL",
        "label": {
          "en": "Poland",
          "ar": "بولندا"
        }
      },
      {
        "countryCode": "RU",
        "label": {
          "en": "Russia",
          "ar": "روسيا"
        }
      },
      {
        "countryCode": "BY",
        "label": {
          "en": "Belarus",
          "ar": "بيلاروسيا"
        }
      },
      {
        "countryCode": "UA",
        "label": {
          "en": "Ukraine",
          "ar": "أوكرانيا"
        }
      },
      {
        "countryCode": "SK",
        "label": {
          "en": "Slovakia",
          "ar": "سلوفاكيا"
        }
      },
      {
        "countryCode": "CZ",
        "label": {
          "en": "Czechia",
          "ar": "التشيك"
        }
      },
      {
        "countryCode": "HU",
        "label": {
          "en": "Hungary",
          "ar": "هنغاريا"
        }
      },
      {
        "countryCode": "RO",
        "label": {
          "en": "Romania",
          "ar": "رومانيا"
        }
      },
      {
        "countryCode": "VN",
        "label": {
          "en": "Vietnam",
          "ar": "فيتنام"
        }
      },
      {
        "countryCode": "CN",
        "label": {
          "en": "China",
          "ar": "الصين"
        }
      },
      {
        "countryCode": "TR",
        "label": {
          "en": "Türkiye",
          "ar": "تركيا"
        }
      },
      {
        "countryCode": "JP",
        "label": {
          "en": "Japan",
          "ar": "اليابان"
        }
      },
      {
        "countryCode": "EG",
        "label": {
          "en": "Egypt",
          "ar": "مصر"
        }
      },
      {
        "countryCode": "IN",
        "label": {
          "en": "India",
          "ar": "الهند"
        }
      },
      {
        "countryCode": "FR",
        "label": {
          "en": "France",
          "ar": "فرنسا"
        }
      },
      {
        "countryCode": "IT",
        "label": {
          "en": "Italy",
          "ar": "إيطاليا"
        }
      },
      {
        "countryCode": "TH",
        "label": {
          "en": "Thailand",
          "ar": "تايلاند"
        }
      },
      {
        "countryCode": "KR",
        "label": {
          "en": "South Korea",
          "ar": "كوريا الجنوبية"
        }
      }
    ],
    "category": "food",
    "difficulty": "hard",
    "tags": [
      "soup",
      "east_europe"
    ],
    "similarityGroup": "food_new_saltibarsciai_lt",
    "distractorNearCodes": [
      "LV",
      "EE",
      "PL",
      "RU",
      "BY",
      "UA",
      "SK",
      "CZ",
      "HU",
      "RO"
    ],
    "distractorFarCodes": [
      "VN",
      "CN",
      "TR",
      "JP",
      "EG",
      "IN",
      "FR",
      "IT",
      "TH",
      "KR"
    ]
  }
] as FoodOriginQuestion[];
