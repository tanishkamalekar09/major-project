"""
STEP 5: Product Classification Engine for ReguCheck AI.

Provides rule-based and keyword-based categorization of packaged food products
into 13 standardized categories with subcategory inference, priority conflict
handling, transparent confidence scoring, and development debug metadata.
"""

import re
from typing import Dict, List, Optional, Tuple, Any, Set
from ...schemas.classification import ProductClassification
from ...schemas.extraction import ProductInformation


class ProductClassifier:
    """
    Transparent, rule-based packaged product classifier.
    Uses multi-field evidence extraction from OCR text, product name,
    brand name, ingredients, and packaging declarations.
    """

    CATEGORIES = [
        "Biscuits",
        "Packaged Snacks",
        "Noodles / Pasta",
        "Beverages",
        "Edible Oils",
        "Dairy Products",
        "Spices / Masala",
        "Packaged Sweets",
        "Breakfast Cereals",
        "Bakery Products",
        "Sauces / Spreads",
        "Other Packaged Food",
        "Unknown"
    ]

    # Non-food disqualification keywords (hygiene, cosmetics, personal care, household)
    NON_FOOD_INDICATORS = [
        r"\bhandwash\b", r"\bhand\s*wash\b", r"\bface\s*wash\b", r"\bfacewash\b",
        r"\bsoap\b", r"\bbody\s*wash\b", r"\bshampoo\b", r"\bconditioner\b",
        r"\bsanitizer\b", r"\bdetergent\b", r"\btoothpaste\b", r"\bskincare\b",
        r"\blotion\b", r"\bdrug\s*mfg\b", r"\bcosmetic\b", r"\bdisinfectant\b",
        r"\bfloor\s*cleaner\b", r"\bliquid\s*handwash\b"
    ]

    # Weighted keyword definitions per category
    # Format: category -> list of tuples (regex_pattern, base_weight, keyword_tag)
    CATEGORY_RULES: Dict[str, List[Tuple[str, float, str]]] = {
        "Biscuits": [
            (r"\bbiscuits?\b", 3.0, "biscuit"),
            (r"\bcookies?\b", 3.0, "cookie"),
            (r"\bbutter\s*cookies?\b", 3.5, "butter cookies"),
            (r"\bglucose\s*biscuits?\b", 3.5, "glucose biscuits"),
            (r"\bcream\s*biscuits?\b", 3.5, "cream biscuits"),
            (r"\bdigestive\s*biscuits?\b", 3.5, "digestive biscuits"),
            (r"\bcrackers?\b", 2.5, "cracker"),
            (r"\bbourbon\b", 2.8, "bourbon"),
            (r"\boreo\b", 2.8, "oreo"),
            (r"\bgood\s*day\b", 2.8, "good day"),
            (r"\bmariegold\b|\bmarie\s*biscuit\b", 2.8, "marie"),
            (r"\bparle-?g\b", 3.0, "parle-g"),
            (r"\bshortbread\b", 2.5, "shortbread"),
            (r"\bwafer\s*biscuits?\b", 3.0, "wafer biscuit"),
        ],
        "Packaged Snacks": [
            (r"\bchips\b", 3.0, "chips"),
            (r"\bpotato\s*chips\b", 4.0, "potato chips"),
            (r"\bnamkeen\b", 3.5, "namkeen"),
            (r"\bbhujia\b|\bbhujiya\b", 3.8, "bhujia"),
            (r"\baloo\s*bhujia\b", 4.2, "aloo bhujia"),
            (r"\bsnacks?\b", 2.0, "snack"),
            (r"\bsev\b|\bratlami\s*sev\b", 3.0, "sev"),
            (r"\bmixture\b", 2.5, "mixture"),
            (r"\bgathiya\b|\bgathia\b", 3.0, "gathiya"),
            (r"\bmurukku\b", 3.0, "murukku"),
            (r"\bkurkure\b", 3.5, "kurkure"),
            (r"\bcrisps?\b", 2.8, "crisps"),
            (r"\bwafers?\b", 2.2, "wafers"),
            (r"\bchana\s*jor\b", 3.0, "chana jor"),
            (r"\bmakhana\b|\broasted\s*makhana\b", 3.2, "makhana"),
            (r"\bnachos?\b|\btortilla\s*chips?\b", 3.5, "nachos"),
            (r"\bpopcorn\b", 3.5, "popcorn"),
            (r"\bchivda\b|\bchiwda\b", 3.2, "chivda"),
            (r"\bkhatta\s*meetha\b", 3.0, "khatta meetha"),
            (r"\bfarsan\b", 3.2, "farsan"),
        ],
        "Noodles / Pasta": [
            (r"\bnoodles?\b", 3.2, "noodles"),
            (r"\binstant\s*noodles?\b", 4.0, "instant noodles"),
            (r"\b2-?minute\s*noodles?\b", 4.2, "2-minute noodles"),
            (r"\bpasta\b", 3.5, "pasta"),
            (r"\bvermicelli\b", 3.5, "vermicelli"),
            (r"\bmacaroni\b", 3.5, "macaroni"),
            (r"\bspaghetti\b", 3.5, "spaghetti"),
            (r"\bfusilli\b", 3.5, "fusilli"),
            (r"\bpenne\b", 3.5, "penne"),
            (r"\bramen\b", 3.5, "ramen"),
            (r"\bchowmein\b", 3.2, "chowmein"),
            (r"\bmaggi\b", 2.8, "maggi"),
            (r"\byippee\b", 3.0, "yippee"),
            (r"\btop\s*ramen\b", 3.5, "top ramen"),
            (r"\bhakka\s*noodles?\b", 3.8, "hakka noodles"),
            (r"\bsewai\b|\bseviyan\b|\bsemiya\b", 3.5, "seviyan"),
        ],
        "Beverages": [
            (r"\bjuice\b|\bfruit\s*juice\b", 3.5, "juice"),
            (r"\bdrink\b|\bfruit\s*drink\b", 2.5, "drink"),
            (r"\bbeverage\b", 2.5, "beverage"),
            (r"\bsoft\s*drink\b", 3.8, "soft drink"),
            (r"\benergy\s*drink\b", 3.8, "energy drink"),
            (r"\bmineral\s*water\b", 3.8, "mineral water"),
            (r"\bnatural\s*mineral\s*water\b", 4.2, "natural mineral water"),
            (r"\bdrinking\s*water\b|\bpackaged\s*drinking\s*water\b", 4.0, "drinking water"),
            (r"\bspring\s*water\b", 3.8, "spring water"),
            (r"\bpackaged\s*water\b", 3.8, "packaged water"),
            (r"\bsoda\b|\bcarbonated\s*water\b", 3.0, "soda"),
            (r"\bcola\b", 3.0, "cola"),
            (r"\bnectar\b", 3.0, "nectar"),
            (r"\bsquash\b", 3.2, "squash"),
            (r"\bsharbat\b|\bsyrup\b", 2.8, "sharbat"),
            (r"\btea\b|\bgreen\s*tea\b|\biced\s*tea\b", 3.2, "tea"),
            (r"\bcoffee\b|\bcold\s*coffee\b", 3.2, "coffee"),
            (r"\brts\s*beverage\b", 3.5, "rts beverage"),
            (r"\bbisleri\b|\baquafina\b|\bkinley\b", 3.0, "water brand"),
        ],
        "Edible Oils": [
            (r"\boil\b", 1.8, "oil"),
            (r"\bcooking\s*oil\b", 3.8, "cooking oil"),
            (r"\bedible\s*oil\b", 4.0, "edible oil"),
            (r"\brefined\s*oil\b", 3.8, "refined oil"),
            (r"\bsunflower\s*oil\b", 4.2, "sunflower oil"),
            (r"\bmustard\s*oil\b", 4.2, "mustard oil"),
            (r"\bcoconut\s*oil\b", 4.0, "coconut oil"),
            (r"\bgroundnut\s*oil\b|\bpeanut\s*oil\b", 4.2, "groundnut oil"),
            (r"\bsoybean\s*oil\b|\bsoya\s*oil\b", 4.2, "soybean oil"),
            (r"\bolive\s*oil\b|\bextra\s*virgin\s*olive\s*oil\b", 4.2, "olive oil"),
            (r"\brice\s*bran\s*oil\b", 4.2, "rice bran oil"),
            (r"\bvegetable\s*oil\b", 3.2, "vegetable oil"),
            (r"\bkachi\s*ghani\b", 3.8, "kachi ghani"),
            (r"\bcold\s*pressed\s*oil\b", 3.8, "cold pressed oil"),
            (r"\b100%\s*pure\s*coconut\s*oil\b", 4.5, "pure coconut oil"),
        ],
        "Dairy Products": [
            (r"\bmilk\b", 2.5, "milk"),
            (r"\btoned\s*milk\b|\bhomogenised\s*toned\s*milk\b", 4.2, "toned milk"),
            (r"\bcow\s*milk\b|\bfull\s*cream\s*milk\b", 4.0, "cow milk"),
            (r"\bpasteuri[sz]ed\s*milk\b", 4.0, "pasteurised milk"),
            (r"\bcurd\b|\bdahi\b", 3.8, "curd"),
            (r"\byogurt\b|\byoghurt\b", 3.8, "yogurt"),
            (r"\bpaneer\b|\bcottage\s*cheese\b", 4.0, "paneer"),
            (r"\bbutter\b|\btable\s*butter\b", 3.2, "butter"),
            (r"\bghee\b|\bdesi\s*ghee\b", 4.0, "ghee"),
            (r"\bcheese\b|\bprocessed\s*cheese\b", 3.2, "cheese"),
            (r"\bbuttermilk\b|\bchaas\b|\blassi\b", 3.8, "buttermilk"),
            (r"\bdairy\s*whitener\b|\bmilk\s*powder\b", 3.5, "dairy whitener"),
            (r"\bamul\s*taaza\b", 4.0, "amul taaza"),
        ],
        "Spices / Masala": [
            (r"\bmasala\b", 2.2, "masala"),
            (r"\bspices?\b", 2.8, "spice"),
            (r"\bturmeric\b|\bturmeric\s*powder\b|\bhaldi\b", 4.2, "turmeric"),
            (r"\bchilli\s*powder\b|\bred\s*chilli\b|\blal\s*mirch\b", 4.2, "chilli powder"),
            (r"\bcoriander\s*powder\b|\bdhaniya\b|\bdhaniya\s*powder\b", 4.2, "coriander powder"),
            (r"\bgaram\s*masala\b", 4.2, "garam masala"),
            (r"\bkitchen\s*king\b", 4.0, "kitchen king"),
            (r"\bsambar\s*powder\b|\bsambar\s*masala\b", 4.0, "sambar powder"),
            (r"\brasam\s*powder\b", 4.0, "rasam powder"),
            (r"\bchhole\s*masala\b|\bpav\s*bhaji\s*masala\b", 4.0, "chhole masala"),
            (r"\bcumin\b|\bjeera\b|\bjeera\s*powder\b", 3.8, "cumin"),
            (r"\bblack\s*pepper\b|\bkali\s*mirch\b", 3.8, "black pepper"),
            (r"\bcardamom\b|\bcloves?\b|\bhing\b|\basafoetida\b", 3.5, "whole spice"),
            (r"\bkasuri\s*methi\b", 3.8, "kasuri methi"),
            (r"\bcurry\s*powder\b", 3.8, "curry powder"),
            (r"\bmasala\s*powder\b", 4.0, "masala powder"),
        ],
        "Packaged Sweets": [
            (r"\bchocolates?\b", 3.5, "chocolate"),
            (r"\bdark\s*chocolate\b|\bmilk\s*chocolate\b", 4.0, "dark chocolate"),
            (r"\bcandy\b|\bcandies\b", 3.5, "candy"),
            (r"\btoffee\b|\btoffees\b", 3.5, "toffee"),
            (r"\bsweets?\b", 2.0, "sweet"),
            (r"\bmithai\b", 3.5, "mithai"),
            (r"\bgulab\s*jamun\b", 4.2, "gulab jamun"),
            (r"\brasgulla\b", 4.2, "rasgulla"),
            (r"\bsoan\s*papdi\b", 4.2, "soan papdi"),
            (r"\bladoo\b|\bladdu\b", 4.0, "ladoo"),
            (r"\bkaju\s*katli\b", 4.2, "kaju katli"),
            (r"\bchikki\b", 3.2, "chikki"),
            (r"\bconfectionery\b", 2.8, "confectionery"),
            (r"\bcaramel\b|\blollipop\b|\bgummy\b", 3.2, "candy item"),
            (r"\bdairy\s*milk\b|\bkitkat\b|\bsnickers\b|\b5\s*star\b", 3.5, "chocolate brand"),
        ],
        "Breakfast Cereals": [
            (r"\bcorn\s*flakes\b|\bcornflakes\b", 4.2, "corn flakes"),
            (r"\boats\b|\brolled\s*oats\b|\binstant\s*oats\b", 4.2, "oats"),
            (r"\bmuesli\b", 4.2, "muesli"),
            (r"\bcereals?\b|\bbreakfast\s*cereal\b", 3.8, "cereal"),
            (r"\bgranola\b", 4.0, "granola"),
            (r"\bwheat\s*flakes\b", 4.0, "wheat flakes"),
            (r"\bchocos\b|\bfroot\s*loops\b", 4.0, "kids cereal"),
            (r"\bporridge\b", 3.2, "porridge"),
        ],
        "Bakery Products": [
            (r"\bbread\b|\bwhite\s*bread\b|\bbrown\s*bread\b", 3.8, "bread"),
            (r"\bcake\b|\bcupcake\b|\btea\s*cake\b|\bplum\s*cake\b", 3.8, "cake"),
            (r"\brusk\b|\btoast\b", 3.8, "rusk"),
            (r"\bbun\b|\bbuns\b|\bpav\b", 3.8, "bun"),
            (r"\bmuffin\b|\bbrownie\b", 3.5, "muffin"),
            (r"\bcroissant\b|\bpastry\b", 3.5, "pastry"),
            (r"\bbakery\b", 2.2, "bakery"),
        ],
        "Sauces / Spreads": [
            (r"\bketchup\b|\btomato\s*ketchup\b", 4.2, "ketchup"),
            (r"\bsauce\b|\btomato\s*sauce\b", 3.2, "sauce"),
            (r"\bjam\b|\bfruit\s*jam\b|\bmixed\s*fruit\s*jam\b", 4.2, "jam"),
            (r"\bspread\b", 2.8, "spread"),
            (r"\bmayonnaise\b|\bmayo\b", 4.0, "mayonnaise"),
            (r"\bchutney\b", 3.5, "chutney"),
            (r"\bdips?\b", 2.8, "dip"),
            (r"\bpeanut\s*butter\b", 4.2, "peanut butter"),
            (r"\bchocolate\s*spread\b|\bhazelnut\s*spread\b", 4.0, "chocolate spread"),
            (r"\bsche[sz]wan\s*sauce\b|\bsche[sz]wan\s*chutney\b", 4.0, "schezwan sauce"),
            (r"\bsoya\s*sauce\b|\bchilli\s*sauce\b", 3.8, "table sauce"),
        ],
        "Other Packaged Food": [
            (r"\bhoney\b|\bnatural\s*honey\b|\bpure\s*natural\s*honey\b", 4.2, "honey"),
            (r"\bsalt\b|\biodi[sz]ed\s*salt\b|\bvacuum\s*evaporated\s*salt\b", 4.2, "salt"),
            (r"\bsugar\b|\bjaggery\b|\bgur\b", 3.5, "sweetener"),
            (r"\batta\b|\bwheat\s*flour\b|\bflour\b|\bmaida\b|\bbesan\b", 3.8, "flour"),
            (r"\brice\b|\bdal\b|\bpulses?\b|\blentils?\b|\bpoha\b", 3.5, "grains and pulses"),
            (r"\bsooji\b|\brava\b", 3.5, "sooji"),
        ]
    }

    # Subcategory definitions per category
    SUBCATEGORY_RULES: Dict[str, List[Tuple[str, str]]] = {
        "Biscuits": [
            (r"\bglucose\b|\bparle-?g\b|\bmilk\s*biscuit\b", "Glucose Biscuits"),
            (r"\bcream\b|\bcreme\b|\bbourbon\b|\boreo\b|\bdark\s*fantasy\b|\btreat\b", "Cream Biscuits"),
            (r"\bcookies?\b|\bbutter\s*cookie\b|\bchocochip\b|\bshortbread\b|\bgood\s*day\b", "Cookies"),
            (r"\bdigestive\b|\bwhole\s*wheat\s*biscuit\b|\bnutrichoice\b", "Digestive Biscuits"),
            (r"\bcrackers?\b|\bmonaco\b|\bkrackjack\b|\bsalted\s*biscuit\b", "Crackers / Salted Biscuits"),
            (r"\bwafer\b", "Wafer Biscuits"),
        ],
        "Packaged Snacks": [
            (r"\bpotato\s*chips\b|\blays\b|\bpotato\s*crisps?\b|\bpotato\s*wafers?\b|\bchips\b", "Potato Chips"),
            (r"\baloo\s*bhujia\b|\bbhujia\b|\bbhujiya\b", "Bhujia"),
            (r"\bnamkeen\b|\bmixture\b|\bsev\b|\bgathiya\b|\bchivda\b|\bfarsan\b|\bkhatta\s*meetha\b|\bnavratan\b", "Namkeen"),
            (r"\bkurkure\b|\bpuffs?\b|\bcorn\s*curls?\b", "Extruded Snacks"),
            (r"\bnachos?\b|\btortilla\b", "Nachos / Tortilla Chips"),
            (r"\bpopcorn\b", "Popcorn"),
            (r"\bmakhana\b|\broasted\b", "Roasted Nuts / Seeds"),
        ],
        "Noodles / Pasta": [
            (r"\binstant\s*noodles?\b|\b2-?minute\s*noodles?\b|\bmaggi\b|\byippee\b|\bramen\b|\bcup\s*noodles?\b", "Instant Noodles"),
            (r"\bpasta\b|\bmacaroni\b|\bpenne\b|\bfusilli\b|\bspaghetti\b|\blasagna\b", "Pasta"),
            (r"\bvermicelli\b|\bsewai\b|\bseviyan\b|\bsemiya\b", "Vermicelli"),
            (r"\bhakka\s*noodles?\b|\bchowmein\b", "Hakka / Chinese Noodles"),
        ],
        "Beverages": [
            (r"\bmineral\s*water\b|\bnatural\s*mineral\s*water\b|\bpackaged\s*water\b|\bdrinking\s*water\b|\bspring\s*water\b|\bhimalayan\b|\bbisleri\b", "Packaged Water"),
            (r"\bjuice\b|\bfruit\s*juice\b|\bnectar\b|\bfruit\s*drink\b|\breal\b|\btropicana\b", "Juice"),
            (r"\bsoft\s*drink\b|\bcola\b|\bsoda\b|\bcarbonated\b|\bpepsi\b|\bcoca-?cola\b|\bsprite\b|\bthums\s*up\b", "Soft Drink"),
            (r"\benergy\s*drink\b|\bred\s*bull\b|\bsting\b", "Energy Drink"),
            (r"\btea\b|\bgreen\s*tea\b|\bchai\b|\bcoffee\b|\bcold\s*coffee\b", "Tea / Coffee"),
            (r"\bsquash\b|\bsharbat\b|\bsyrup\b", "Squash / Syrup"),
        ],
        "Edible Oils": [
            (r"\bmustard\s*oil\b|\bsarson\b|\bkachi\s*ghani\b", "Mustard Oil"),
            (r"\bsunflower\s*oil\b", "Sunflower Oil"),
            (r"\bcoconut\s*oil\b", "Coconut Oil"),
            (r"\bgroundnut\s*oil\b|\bpeanut\s*oil\b", "Groundnut Oil"),
            (r"\bsoybean\s*oil\b|\bsoya\s*oil\b", "Soybean Oil"),
            (r"\bolive\s*oil\b", "Olive Oil"),
            (r"\brice\s*bran\s*oil\b", "Rice Bran Oil"),
            (r"\brefined\s*oil\b|\bcooking\s*oil\b|\bvegetable\s*oil\b", "Refined Vegetable Oil"),
        ],
        "Dairy Products": [
            (r"\btoned\s*milk\b|\bcow\s*milk\b|\bhomogenised\s*toned\s*milk\b|\bpasteuri[sz]ed\s*milk\b|\bmilk\b|\bamul\s*taaza\b", "Milk"),
            (r"\bcurd\b|\bdahi\b|\byogurt\b|\byoghurt\b", "Curd / Yogurt"),
            (r"\bpaneer\b|\bcottage\s*cheese\b", "Paneer"),
            (r"\bghee\b|\bdesi\s*ghee\b", "Ghee"),
            (r"\bbutter\b|\btable\s*butter\b", "Butter"),
            (r"\bcheese\b|\bprocessed\s*cheese\b", "Cheese"),
            (r"\bbuttermilk\b|\bchaas\b|\blassi\b", "Buttermilk / Lassi"),
        ],
        "Spices / Masala": [
            (r"\bturmeric\b|\bhaldi\b", "Turmeric"),
            (r"\bchilli\s*powder\b|\bred\s*chilli\b|\blal\s*mirch\b", "Chilli Powder"),
            (r"\bcoriander\b|\bdhaniya\b", "Coriander Powder"),
            (r"\bgaram\s*masala\b", "Garam Masala"),
            (r"\bkitchen\s*king\b|\bsambar\b|\brasam\b|\bchhole\b|\bpav\s*bhaji\b|\bcurry\s*powder\b", "Blended Spices / Masala"),
            (r"\bcumin\b|\bjeera\b|\bpepper\b|\bcardamom\b|\bcloves?\b", "Whole Spices"),
        ],
        "Packaged Sweets": [
            (r"\bchocolates?\b|\bdark\s*chocolate\b|\bmilk\s*chocolate\b|\bcadbury\b|\bkitkat\b", "Chocolates"),
            (r"\bmithai\b|\bgulab\s*jamun\b|\brasgulla\b|\bsoan\s*papdi\b|\bladoo\b|\bladdu\b|\bkaju\s*katli\b", "Traditional Sweets / Mithai"),
            (r"\bcandy\b|\bcandies\b|\btoffee\b|\btoffees\b|\blollipop\b", "Candies / Toffees"),
            (r"\bgum\b|\bmint\b", "Gums / Mints"),
        ],
        "Breakfast Cereals": [
            (r"\bcorn\s*flakes\b|\bcornflakes\b", "Corn Flakes"),
            (r"\boats\b|\brolled\s*oats\b|\binstant\s*oats\b", "Oats"),
            (r"\bmuesli\b", "Muesli"),
            (r"\bgranola\b", "Granola"),
            (r"\bchocos\b|\bfroot\s*loops\b", "Children's Cereals"),
        ],
        "Bakery Products": [
            (r"\bbread\b|\bwhite\s*bread\b|\bbrown\s*bread\b|\bmultigrain\s*bread\b", "Bread"),
            (r"\bcake\b|\bcupcake\b|\bmuffin\b|\bbrownie\b|\bpastry\b", "Cake / Pastry"),
            (r"\brusk\b|\btoast\b", "Rusk / Toast"),
            (r"\bbun\b|\bbuns\b|\bpav\b", "Buns / Pav"),
        ],
        "Sauces / Spreads": [
            (r"\bketchup\b|\btomato\s*ketchup\b|\btomato\s*sauce\b", "Tomato Ketchup / Sauce"),
            (r"\bjam\b|\bfruit\s*jam\b|\bmarmalade\b", "Jam / Fruit Spread"),
            (r"\bmayonnaise\b|\bmayo\b", "Mayonnaise"),
            (r"\bchutney\b|\bdips?\b|\bsalsa\b", "Chutney / Dips"),
            (r"\bpeanut\s*butter\b|\bchocolate\s*spread\b|\bhazelnut\b", "Peanut Butter / Spreads"),
            (r"\bsoya\s*sauce\b|\bchilli\s*sauce\b|\bschezwan\b", "Culinary Sauces"),
        ],
        "Other Packaged Food": [
            (r"\bhoney\b", "Honey"),
            (r"\bsalt\b|\biodi[sz]ed\s*salt\b", "Iodized Salt"),
            (r"\bsugar\b|\bjaggery\b|\bgur\b", "Sugar / Sweetener"),
            (r"\batta\b|\bflour\b|\bbesan\b|\bmaida\b|\bsooji\b", "Flour / Atta"),
            (r"\brice\b|\bdal\b|\bpulses?\b|\blentils?\b", "Grains & Pulses"),
        ]
    }

    def __init__(self):
        # Precompile regexes for performance
        self._compiled_non_food = [re.compile(p, re.IGNORECASE) for p in self.NON_FOOD_INDICATORS]
        self._compiled_rules: Dict[str, List[Tuple[re.Pattern, float, str]]] = {}
        for cat, rule_list in self.CATEGORY_RULES.items():
            self._compiled_rules[cat] = [
                (re.compile(pattern, re.IGNORECASE), weight, tag)
                for pattern, weight, tag in rule_list
            ]

        self._compiled_subcategories: Dict[str, List[Tuple[re.Pattern, str]]] = {}
        for cat, sub_list in self.SUBCATEGORY_RULES.items():
            self._compiled_subcategories[cat] = [
                (re.compile(pattern, re.IGNORECASE), sub_name)
                for pattern, sub_name in sub_list
            ]

    # -------------------------------------------------------------------------
    # Text Normalization
    # -------------------------------------------------------------------------
    def normalize_text(self, text: Optional[str]) -> str:
        """
        Normalize OCR text to mitigate minor OCR character errors
        (e.g., c00kies -> cookies, m!lk -> milk, b1scuit -> biscuit).
        """
        if not text:
            return ""
        
        # Lowercase and clean excess whitespace
        s = text.lower().strip()
        s = re.sub(r"[\r\n\t]+", " ", s)

        # Common OCR glyph substitutions inside words
        s = re.sub(r"\bc00kie", "cookie", s)
        s = re.sub(r"\bn00dle", "noodle", s)
        s = re.sub(r"\bb!scuit", "biscuit", s)
        s = re.sub(r"\bb1scuit", "biscuit", s)
        s = re.sub(r"\bm!lk\b", "milk", s)
        s = re.sub(r"\bch!ps\b", "chips", s)
        s = re.sub(r"\b0il\b", "oil", s)
        s = re.sub(r"\b5nack", "snack", s)

        # Normalize multiple spaces
        s = re.sub(r"\s+", " ", s).strip()
        return s

    # -------------------------------------------------------------------------
    # Main Classification Pipeline
    # -------------------------------------------------------------------------
    def classify(
        self,
        ocr_result: Optional[Any] = None,
        product_information: Optional[ProductInformation] = None,
        product_name: Optional[str] = None,
        brand_name: Optional[str] = None,
        raw_text: Optional[str] = None,
        ingredients: Optional[str] = None,
    ) -> ProductClassification:
        """
        Classifies a packaged product into one of the 13 categories.
        
        Args:
            ocr_result: Complete OCRResult object (has raw_text and blocks)
            product_information: Extracted ProductInformation object (Step 4)
            product_name: Direct override / fallback for product title
            brand_name: Direct override / fallback for brand
            raw_text: Direct override / fallback for raw OCR text
            ingredients: Direct override / fallback for ingredients
            
        Returns:
            ProductClassification object with category, subcategory,
            confidence score, classification method, and debug metadata.
        """
        # Resolve field values from provided objects
        extracted_prod_name = None
        extracted_brand = None
        extracted_ingredients = None
        avg_ocr_conf = 0.85

        if product_information:
            if product_information.product_name and product_information.product_name.value:
                extracted_prod_name = product_information.product_name.value
            if product_information.brand_name and product_information.brand_name.value:
                extracted_brand = product_information.brand_name.value
            if product_information.ingredients and product_information.ingredients.value:
                extracted_ingredients = product_information.ingredients.value

        if ocr_result:
            if not raw_text:
                raw_text = getattr(ocr_result, "raw_text", "")
            blocks = getattr(ocr_result, "blocks", [])
            if blocks:
                confs = [getattr(b, "confidence", 0.85) for b in blocks if getattr(b, "confidence", None) is not None]
                if confs:
                    avg_ocr_conf = sum(confs) / len(confs)

        prod_name_val = product_name or extracted_prod_name or ""
        brand_val = brand_name or extracted_brand or ""
        raw_text_val = raw_text or ""
        ing_val = ingredients or extracted_ingredients or ""

        # Normalize texts
        norm_prod_name = self.normalize_text(prod_name_val)
        norm_brand = self.normalize_text(brand_val)
        norm_raw = self.normalize_text(raw_text_val)
        norm_ing = self.normalize_text(ing_val)

        # Combined text for top packaging lines (lines 1 to 4 of raw OCR)
        raw_lines = [l.strip() for l in raw_text_val.splitlines() if l.strip()]
        top_lines = " ".join([self.normalize_text(l) for l in raw_lines[:4]])

        # ---------------------------------------------------------------------
        # 1. Edge Case: Empty or Insufficient Input
        # ---------------------------------------------------------------------
        if not norm_raw and not norm_prod_name and not norm_brand:
            return ProductClassification(
                category="Unknown",
                subcategory=None,
                confidence=None,
                method="insufficient_information",
                matched_keywords=[],
                matched_fields=[],
                classification_score=0.0,
                selected_category="Unknown",
                selected_subcategory=None
            )

        # ---------------------------------------------------------------------
        # 2. Non-Food Filter (Cosmetics, Hygiene, Personal Care Disqualification)
        # ---------------------------------------------------------------------
        for pattern in self._compiled_non_food:
            match = pattern.search(norm_prod_name) or pattern.search(norm_raw)
            if match:
                # Disqualify from food categories
                return ProductClassification(
                    category="Unknown",
                    subcategory=None,
                    confidence=None,
                    method="insufficient_information",
                    matched_keywords=[match.group(0)],
                    matched_fields=["non_food_indicator"],
                    classification_score=0.0,
                    selected_category="Unknown",
                    selected_subcategory=None
                )

        # ---------------------------------------------------------------------
        # 3. Weighted Scoring Mechanism Across Categories
        # ---------------------------------------------------------------------
        scores: Dict[str, float] = {cat: 0.0 for cat in self.CATEGORIES if cat != "Unknown"}
        matched_kw_map: Dict[str, Set[str]] = {cat: set() for cat in scores}
        matched_fields_map: Dict[str, Set[str]] = {cat: set() for cat in scores}

        # Field weights
        FIELD_WEIGHTS = {
            "product_name": 4.5,
            "top_lines": 3.0,
            "brand_name": 1.5,
            "raw_text": 1.2,
            "ingredients": 0.6,
        }

        # Check each category's rules against each field
        for cat, rules in self._compiled_rules.items():
            for pattern, base_weight, tag in rules:
                # 1. Match in Product Name (highest authority)
                if norm_prod_name and pattern.search(norm_prod_name):
                    scores[cat] += base_weight * FIELD_WEIGHTS["product_name"]
                    matched_kw_map[cat].add(tag)
                    matched_fields_map[cat].add("product_name")

                # 2. Match in Top Display Lines
                elif top_lines and pattern.search(top_lines):
                    scores[cat] += base_weight * FIELD_WEIGHTS["top_lines"]
                    matched_kw_map[cat].add(tag)
                    matched_fields_map[cat].add("top_lines")

                # 3. Match in Brand Name
                if norm_brand and pattern.search(norm_brand):
                    scores[cat] += base_weight * FIELD_WEIGHTS["brand_name"]
                    matched_kw_map[cat].add(tag)
                    matched_fields_map[cat].add("brand_name")

                # 4. Match in Raw OCR Text
                if norm_raw and pattern.search(norm_raw):
                    # Prevent redundant double counting if already matched in product_name
                    if "product_name" not in matched_fields_map[cat]:
                        scores[cat] += base_weight * FIELD_WEIGHTS["raw_text"]
                    matched_kw_map[cat].add(tag)
                    matched_fields_map[cat].add("raw_text")

                # 5. Match in Ingredients
                if norm_ing and pattern.search(norm_ing):
                    scores[cat] += base_weight * FIELD_WEIGHTS["ingredients"]
                    matched_kw_map[cat].add(tag)
                    matched_fields_map[cat].add("ingredients")

        # ---------------------------------------------------------------------
        # 4. Priority / Conflict Disambiguation Rules
        # ---------------------------------------------------------------------
        full_context = f"{norm_prod_name} {norm_raw}"

        # Conflict A: "Masala Potato Chips" -> Chips (Snacks), NOT Spices
        # When snack indicators are present with flavor words like "masala", "chilli", "spicy"
        has_snack_core = any(re.search(r"\b" + kw + r"\b", full_context) for kw in ["chips", "bhujia", "namkeen", "sev", "crisps", "wafers", "snack"])
        has_flavor_spice = any(re.search(r"\b" + kw + r"\b", full_context) for kw in ["masala", "spicy", "chilli", "salted", "pudina", "onion", "mint"])
        if has_snack_core and has_flavor_spice:
            scores["Packaged Snacks"] += 8.0
            scores["Spices / Masala"] = max(0.0, scores["Spices / Masala"] - 12.0)

        # Conflict B: "Aloo Bhujia Spicy Potato Noodles" -> Bhujia (Snacks), NOT Noodles
        if re.search(r"\bbhujia\b|\baloo\s*bhujia\b", full_context):
            scores["Packaged Snacks"] += 10.0
            scores["Noodles / Pasta"] = max(0.0, scores["Noodles / Pasta"] - 15.0)

        # Conflict C: "Maggi 2-Minute Noodles Masala" -> Noodles / Pasta, NOT Spices
        if re.search(r"\bnoodles?\b", full_context) and re.search(r"\bmaggi\b|\binstant\b|2-?minute", full_context):
            scores["Noodles / Pasta"] += 8.0
            scores["Spices / Masala"] = max(0.0, scores["Spices / Masala"] - 10.0)

        # Conflict D: Biscuits vs Bakery Products
        # If "cookie", "biscuit", "cracker" is present, classify as "Biscuits" rather than generic "Bakery Products"
        if re.search(r"\bbiscuits?\b|\bcookies?\b|\bcrackers?\b", full_context):
            scores["Biscuits"] += 8.0
            scores["Bakery Products"] = max(0.0, scores["Bakery Products"] - 6.0)

        # Conflict E: Oil inside Ingredients vs Pure Edible Oil
        # Edible oil must appear in product_name, brand, or top_lines. If "oil" only in ingredients, penalize.
        if "product_name" not in matched_fields_map["Edible Oils"] and "top_lines" not in matched_fields_map["Edible Oils"]:
            if not re.search(r"\b100%\s*pure\s*coconut\s*oil\b|\bedible\s*oil\b|\bcooking\s*oil\b|\brefined\s*oil\b", full_context):
                scores["Edible Oils"] = max(0.0, scores["Edible Oils"] - 8.0)

        # Conflict F: Milk / Dairy inside Ingredients vs Pure Dairy Product
        # If dairy keywords (like "milk solids") only in ingredients and another category (like Biscuits or Sweets) has score
        if "product_name" not in matched_fields_map["Dairy Products"] and "top_lines" not in matched_fields_map["Dairy Products"]:
            if scores["Biscuits"] > 4.0 or scores["Packaged Sweets"] > 4.0:
                scores["Dairy Products"] = max(0.0, scores["Dairy Products"] - 6.0)

        # Conflict G: Commodity ingredients (salt, sugar, flour) vs Specific Finished Products (e.g. Bread, Biscuits, Noodles, Snacks)
        # If Other Packaged Food did not match in product_name or top_lines, and another category matched in product_name or top_lines,
        # penalize Other Packaged Food so common ingredient list words don't override the actual product.
        if "product_name" not in matched_fields_map["Other Packaged Food"] and "top_lines" not in matched_fields_map["Other Packaged Food"]:
            any_other_primary = any(
                ("product_name" in matched_fields_map[c] or "top_lines" in matched_fields_map[c])
                for c in scores if c != "Other Packaged Food"
            )
            if any_other_primary:
                scores["Other Packaged Food"] = max(0.0, scores["Other Packaged Food"] - 15.0)

        # ---------------------------------------------------------------------
        # 5. Winner Selection & Minimum Confidence Threshold
        # ---------------------------------------------------------------------
        sorted_categories = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        top_category, top_score = sorted_categories[0]
        second_category, second_score = sorted_categories[1] if len(sorted_categories) > 1 else ("Unknown", 0.0)

        MINIMUM_CONFIDENCE_THRESHOLD = 2.2

        if top_score < MINIMUM_CONFIDENCE_THRESHOLD:
            return ProductClassification(
                category="Unknown",
                subcategory=None,
                confidence=None,
                method="insufficient_information",
                matched_keywords=[],
                matched_fields=[],
                classification_score=round(top_score, 2),
                selected_category="Unknown",
                selected_subcategory=None
            )

        # ---------------------------------------------------------------------
        # 6. Subcategory Resolution
        # ---------------------------------------------------------------------
        determined_subcategory: Optional[str] = None
        subcat_rules = self._compiled_subcategories.get(top_category, [])

        # Priority 1: Check in product name
        for sub_pattern, sub_name in subcat_rules:
            if norm_prod_name and sub_pattern.search(norm_prod_name):
                determined_subcategory = sub_name
                break

        # Priority 2: Check in full context if not found in product name
        if not determined_subcategory:
            for sub_pattern, sub_name in subcat_rules:
                if sub_pattern.search(full_context):
                    determined_subcategory = sub_name
                    break

        # ---------------------------------------------------------------------
        # 7. Transparent Rule-Based Confidence Calculation
        # ---------------------------------------------------------------------
        # Base confidence determined by source evidence location
        matched_fields = list(matched_fields_map[top_category])
        matched_keywords = sorted(list(matched_kw_map[top_category]))

        if "product_name" in matched_fields:
            base_confidence = 0.88
        elif "top_lines" in matched_fields or "brand_name" in matched_fields:
            base_confidence = 0.82
        else:
            base_confidence = 0.72

        # Bonus for multiple matching keywords in the category
        if len(matched_keywords) >= 2:
            base_confidence += 0.05
        if len(matched_keywords) >= 3:
            base_confidence += 0.03

        # Bonus for decisive subcategory identification
        if determined_subcategory is not None:
            base_confidence += 0.03

        # Bonus for cross-field verification (e.g. matched in product_name AND raw_text)
        if len(matched_fields) >= 2:
            base_confidence += 0.02

        # Adjustment for OCR quality
        if avg_ocr_conf < 0.60:
            base_confidence -= 0.10
        elif avg_ocr_conf >= 0.85:
            base_confidence += 0.02

        # Adjustment for decisive score margin over second best category
        score_margin = top_score - second_score
        if score_margin >= 4.0:
            base_confidence += 0.02
        elif score_margin < 1.0:
            base_confidence -= 0.06

        final_confidence = round(min(0.99, max(0.50, base_confidence)), 2)

        return ProductClassification(
            category=top_category,
            subcategory=determined_subcategory,
            confidence=final_confidence,
            method="rule_based",
            matched_keywords=matched_keywords,
            matched_fields=matched_fields,
            classification_score=round(top_score, 2),
            selected_category=top_category,
            selected_subcategory=determined_subcategory
        )
