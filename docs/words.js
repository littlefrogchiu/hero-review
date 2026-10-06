// 康軒 B5 各課字詞例句表（課本附錄1）
const WORDS = {
 "1": [
  {
   "en": "subject",
   "pos": "n.",
   "zh": "學科",
   "ex": "Nina’s favorite subjects are science and history."
  },
  {
   "en": "history",
   "pos": "n.",
   "zh": "歷史",
   "ex": "The beautiful temple has a long history."
  },
  {
   "en": "topic",
   "pos": "n.",
   "zh": "主題",
   "ex": "I can’t think of another topic for my report."
  },
  {
   "en": "hairdryer",
   "pos": "n.",
   "zh": "吹風機（= hair dryer）",
   "ex": "After Jean washes her hair, she uses the hairdryer to dry her hair."
  },
  {
   "en": "yet",
   "pos": "adv.",
   "zh": "還（沒）；尚（未）",
   "ex": "I can’t go to the movies because I haven’t finished my report yet."
  },
  {
   "en": "century",
   "pos": "n.",
   "zh": "世紀",
   "ex": "We live in the 21st century."
  },
  {
   "en": "freeze",
   "pos": "v.",
   "zh": "凍結；結冰",
   "ex": "The lakes here freeze in winter."
  },
  {
   "en": "potato",
   "pos": "n.",
   "zh": "馬鈴薯",
   "ex": "Tina made potato salad for dinner tonight."
  },
  {
   "en": "stick",
   "pos": "n.",
   "zh": "枝條",
   "ex": "Let’s find some dry sticks to make a fire."
  },
  {
   "en": "American",
   "pos": "adj.",
   "zh": "美國的；n. 美國人",
   "ex": "Stephen Curry is an American basketball player."
  },
  {
   "en": "soldier",
   "pos": "n.",
   "zh": "士兵；軍人",
   "ex": "John wanted to be a soldier, but he became a teacher in the end."
  },
  {
   "en": "main",
   "pos": "adj.",
   "zh": "主要的",
   "ex": "We don’t have enough money. That’s our main problem."
  },
  {
   "en": "language",
   "pos": "n.",
   "zh": "語言",
   "ex": "I’m not good at learning languages."
  },
  {
   "en": "since",
   "pos": "prep.; conj.",
   "zh": "自……以來",
   "ex": "Nick hasn’t played baseball since he hurt his legs."
  },
  {
   "en": "celebrate",
   "pos": "v.",
   "zh": "慶祝",
   "ex": "We are going out for a meal to celebrate my birthday."
  },
  {
   "en": "national",
   "pos": "adj.",
   "zh": "國家的；國立的",
   "ex": "Let’s take a look at the national news."
  },
  {
   "en": "thick",
   "pos": "adj.",
   "zh": "粗的；厚的",
   "ex": "The sticks are too thick. I can’t break them."
  },
  {
   "en": "fry",
   "pos": "v.",
   "zh": "油炸；油煎",
   "ex": "Sam fried two eggs for breakfast this morning."
  },
  {
   "en": "chocolate",
   "pos": "n.",
   "zh": "巧克力",
   "ex": "My father brought a chocolate cake home last night."
  },
  {
   "en": "bunny",
   "pos": "n.",
   "zh": "小兔子",
   "ex": "Do you know the story of the Easter bunny?"
  },
  {
   "en": "candy",
   "pos": "n.",
   "zh": "糖果",
   "ex": "Emma bought me a box of candies from Japan."
  },
  {
   "en": "pumpkin",
   "pos": "n.",
   "zh": "南瓜",
   "ex": "We always eat pumpkin pies on Thanksgiving."
  },
  {
   "en": "bake",
   "pos": "v.",
   "zh": "烘烤",
   "ex": "Jenny baked the cake for 45 minutes."
  },
  {
   "en": "Christmas Eve",
   "pos": "",
   "zh": "聖誕節前夕；平安夜",
   "ex": "What are we going to eat on Christmas Eve?"
  },
  {
   "en": "nobody",
   "pos": "pron.",
   "zh": "沒有人",
   "ex": "Nobody agreed with Leo."
  },
  {
   "en": "wave",
   "pos": "v.",
   "zh": "揮（手）",
   "ex": "Alex waved at us and said goodbye."
  },
  {
   "en": "inch",
   "pos": "n.",
   "zh": "英寸",
   "ex": "The snow was 5 inches deep in this area."
  },
  {
   "en": "king",
   "pos": "n.",
   "zh": "國王；王者",
   "ex": "The king owns a lot of land."
  }
 ],
 "2": [
  {
   "en": "delivery",
   "pos": "n.",
   "zh": "運送",
   "ex": "Delivery is free for orders of NT$500 or over."
  },
  {
   "en": "among",
   "pos": "prep.",
   "zh": "在……中",
   "ex": "Jake is the tallest among those boys."
  },
  {
   "en": "age",
   "pos": "n.",
   "zh": "年齡",
   "ex": "The soldier died at the age of 25."
  },
  {
   "en": "chart",
   "pos": "n.",
   "zh": "圖表",
   "ex": "Look at the weather chart. It will be sunny tomorrow."
  },
  {
   "en": "page",
   "pos": "n.",
   "zh": "頁；網頁",
   "ex": "Please turn to page 5."
  },
  {
   "en": "interested",
   "pos": "adj.",
   "zh": "感興趣的",
   "ex": "Ben is interested in the history of the USA."
  },
  {
   "en": "reason",
   "pos": "n.",
   "zh": "原因",
   "ex": "Sara went home early from school, but she didn’t tell me the reason."
  },
  {
   "en": "helpful",
   "pos": "adj.",
   "zh": "有用的",
   "ex": "If you can’t sleep at night, having some warm milk might be helpful."
  },
  {
   "en": "tired",
   "pos": "adj.",
   "zh": "疲勞的",
   "ex": "Dave was tired after a long day at the office."
  },
  {
   "en": "offer",
   "pos": "v.",
   "zh": "提供",
   "ex": "I would like to offer help if you need it."
  },
  {
   "en": "discount",
   "pos": "n.",
   "zh": "折扣",
   "ex": "Students in Taipei get a discount when they take the bus."
  },
  {
   "en": "driver",
   "pos": "n.",
   "zh": "駕駛；司機",
   "ex": "David is a good driver. He drives carefully."
  },
  {
   "en": "uniform",
   "pos": "n.",
   "zh": "制服",
   "ex": "Most students in Taiwan have to wear uniforms to school."
  },
  {
   "en": "excited",
   "pos": "adj.",
   "zh": "感到興奮的",
   "ex": "Amy is very excited about the robot show."
  },
  {
   "en": "boring",
   "pos": "adj.",
   "zh": "無聊的；無趣的",
   "ex": "The movie wasn’t interesting. It was boring."
  },
  {
   "en": "bored",
   "pos": "adj.",
   "zh": "感到厭煩的",
   "ex": "Mr. Wilson was bored with his life in a small town."
  },
  {
   "en": "tiring",
   "pos": "adj.",
   "zh": "令人疲倦的",
   "ex": "Taking care of children is tiring to Jamie."
  },
  {
   "en": "surprising",
   "pos": "adj.",
   "zh": "令人驚訝的",
   "ex": "It is surprising that they want to sell the house."
  },
  {
   "en": "surprised",
   "pos": "adj.",
   "zh": "感到驚訝的",
   "ex": "We were surprised at his idea of starting a new shop."
  },
  {
   "en": "tip",
   "pos": "v.",
   "zh": "給……小費；n. 小費",
   "ex": "Tom tipped the waitress three dollars."
  },
  {
   "en": "couch",
   "pos": "n.",
   "zh": "沙發",
   "ex": "The couch is so comfortable. I can sit on it all day."
  },
  {
   "en": "interest",
   "pos": "n.",
   "zh": "興趣；v. 使……感興趣",
   "ex": "Larry has shown an interest in music since he was five."
  },
  {
   "en": "mind",
   "pos": "v.",
   "zh": "介意",
   "ex": "Would you mind waiting outside?"
  },
  {
   "en": "chance",
   "pos": "n.",
   "zh": "機會",
   "ex": "Is there any chance of getting the movie tickets?"
  },
  {
   "en": "list",
   "pos": "n.",
   "zh": "清單",
   "ex": "Jane forgot to bring her shopping list with her."
  },
  {
   "en": "at least",
   "pos": "",
   "zh": "至少",
   "ex": "It will take you at least 30 minutes to get to the museum."
  },
  {
   "en": "location",
   "pos": "n.",
   "zh": "位置",
   "ex": "The office building is in a good location."
  },
  {
   "en": "tap",
   "pos": "v.",
   "zh": "輕觸",
   "ex": "I tapped him on the head, and he turned around."
  },
  {
   "en": "button",
   "pos": "n.",
   "zh": "按鈕；鈕扣",
   "ex": "Push the button and turn on the light."
  }
 ],
 "3": [
  {
   "en": "form",
   "pos": "v.",
   "zh": "形成",
   "ex": "The students formed a line behind their teacher."
  },
  {
   "en": "childhood",
   "pos": "n.",
   "zh": "童年",
   "ex": "I had a happy childhood."
  },
  {
   "en": "relative",
   "pos": "n.",
   "zh": "親戚",
   "ex": "People in Taiwan usually visit their relatives during Chinese New Year."
  },
  {
   "en": "expect",
   "pos": "v.",
   "zh": "期待；預計",
   "ex": "I didn’t expect to see Mr. Simpson at the meeting."
  },
  {
   "en": "public",
   "pos": "adj.",
   "zh": "公共的；n. 大眾",
   "ex": "The public library isn’t open on Mondays."
  },
  {
   "en": "such as",
   "pos": "",
   "zh": "例如；像",
   "ex": "I like outdoor sports, such as soccer and baseball."
  },
  {
   "en": "everywhere",
   "pos": "adv.",
   "zh": "到處",
   "ex": "I looked everywhere for my cellphone."
  },
  {
   "en": "company",
   "pos": "n.",
   "zh": "公司",
   "ex": "Mr. Jones joined our company last month."
  },
  {
   "en": "equal",
   "pos": "adj.",
   "zh": "平等的",
   "ex": "All people are equal."
  },
  {
   "en": "hard-working",
   "pos": "adj.",
   "zh": "勤勉的",
   "ex": "Kathy studies a lot. She is a hard-working student."
  },
  {
   "en": "lawyer",
   "pos": "n.",
   "zh": "律師",
   "ex": "He didn’t answer any questions until his lawyer came."
  },
  {
   "en": "engineer",
   "pos": "n.",
   "zh": "工程師",
   "ex": "My aunt is an engineer. She can fix computers."
  },
  {
   "en": "president",
   "pos": "n.",
   "zh": "總統",
   "ex": "Who is the president of the USA?"
  },
  {
   "en": "model",
   "pos": "n.",
   "zh": "榜樣；模範",
   "ex": "Lady Gaga is a role model for many teenagers."
  },
  {
   "en": "picture",
   "pos": "v.",
   "zh": "想像",
   "ex": "I can’t picture David as a police officer."
  },
  {
   "en": "lovely",
   "pos": "adj.",
   "zh": "討人喜歡的；漂亮的",
   "ex": "Jennifer looks lovely in that dress."
  },
  {
   "en": "born",
   "pos": "adj.",
   "zh": "出生的；誕生的",
   "ex": "Peter was born on June 12, 2005."
  },
  {
   "en": "present",
   "pos": "n.",
   "zh": "禮物；v. 展現",
   "ex": "Julia got a lot of presents on her birthday."
  },
  {
   "en": "pretty",
   "pos": "adj.",
   "zh": "漂亮的",
   "ex": "Zoe looks much prettier when she smiles."
  },
  {
   "en": "brave",
   "pos": "adj.",
   "zh": "勇敢的",
   "ex": "It was brave of you to save the boy."
  },
  {
   "en": "be filled with",
   "pos": "",
   "zh": "充滿",
   "ex": "The streets are filled with cars and people."
  },
  {
   "en": "stupid",
   "pos": "adj.",
   "zh": "愚蠢的；笨的",
   "ex": "It is stupid and dangerous to run a red light."
  },
  {
   "en": "honest",
   "pos": "adj.",
   "zh": "誠實的",
   "ex": "Larry is an honest and hard-working student."
  },
  {
   "en": "spider",
   "pos": "n.",
   "zh": "蜘蛛",
   "ex": "Allan is afraid of spiders. He thinks they are scary."
  },
  {
   "en": "comic",
   "pos": "n.",
   "zh": "漫畫",
   "ex": "Kelly has collected over five hundred comic books since she was ten."
  },
  {
   "en": "mad",
   "pos": "adj.",
   "zh": "惱火的",
   "ex": "Mr. Jones was mad at me because I didn’t do my homework."
  },
  {
   "en": "totally",
   "pos": "adv.",
   "zh": "完全",
   "ex": "I totally agree with you."
  },
  {
   "en": "understand",
   "pos": "v.",
   "zh": "了解",
   "ex": "Sandra explained her idea again, but I still didn’t understand."
  },
  {
   "en": "hope",
   "pos": "v.; n.",
   "zh": "希望",
   "ex": "I hope our team will win the basketball game."
  },
  {
   "en": "allow",
   "pos": "v.",
   "zh": "允許",
   "ex": "Kids under 6 are not allowed in this restaurant."
  },
  {
   "en": "laugh at",
   "pos": "",
   "zh": "嘲笑",
   "ex": "Stop laughing at your brother, Lily."
  }
 ],
 "4": [
  {
   "en": "create",
   "pos": "v.",
   "zh": "創造",
   "ex": "The new factory created at least 100 new jobs."
  },
  {
   "en": "dictionary",
   "pos": "n.",
   "zh": "字典",
   "ex": "If you want to know the meaning of a word, you can look it up in the dictionary."
  },
  {
   "en": "case",
   "pos": "n.",
   "zh": "實例",
   "ex": "In my case, when I started teaching English, I enjoyed it right away."
  },
  {
   "en": "combine",
   "pos": "v.",
   "zh": "結合；合併",
   "ex": "This book combines history with art in a special way."
  },
  {
   "en": "pleasure",
   "pos": "n.",
   "zh": "樂趣；榮幸",
   "ex": "A: Thanks for your help.\nB: It was my pleasure."
  },
  {
   "en": "notebook (computer)",
   "pos": "n.",
   "zh": "筆記型電腦",
   "ex": "The notebook (computer) is light and easy to carry around."
  },
  {
   "en": "e-mail",
   "pos": "n.",
   "zh": "電子郵件",
   "ex": "Ms. White sent her secretary an e-mail this morning."
  },
  {
   "en": "by accident",
   "pos": "",
   "zh": "意外地",
   "ex": "The fire started by accident last night."
  },
  {
   "en": "lip",
   "pos": "n.",
   "zh": "嘴唇",
   "ex": "The boy has big eyes and full lips."
  },
  {
   "en": "whether",
   "pos": "conj.",
   "zh": "是否",
   "ex": "Ask Peter whether he can come or not."
  },
  {
   "en": "define",
   "pos": "v.",
   "zh": "定義",
   "ex": "It’s hard for me to define the word “love.”"
  },
  {
   "en": "idiom",
   "pos": "n.",
   "zh": "慣用語",
   "ex": "Ann: \u0007What does the idiom “let the cat out of the bag” mean?\nBen: It means “To tell a secret by mistake.”"
  },
  {
   "en": "butterfly",
   "pos": "n.",
   "zh": "蝴蝶",
   "ex": "There is a big butterfly flying around the flowers."
  },
  {
   "en": "interview",
   "pos": "n.; v.",
   "zh": "面試；採訪",
   "ex": "Bill has an interview for a teaching job next week."
  },
  {
   "en": "hen",
   "pos": "n.",
   "zh": "母雞",
   "ex": "My grandpa keeps three hens in back of his house."
  },
  {
   "en": "salesman",
   "pos": "n.",
   "zh": "銷售員",
   "ex": "The salesman is trying to sell the car to me."
  },
  {
   "en": "blind",
   "pos": "adj.",
   "zh": "瞎的；盲的",
   "ex": "Judy is blind in her left eye."
  },
  {
   "en": "bat",
   "pos": "n.",
   "zh": "蝙蝠",
   "ex": "Bats fly and feed at night."
  },
  {
   "en": "glasses",
   "pos": "n.",
   "zh": "眼鏡",
   "ex": "Daisy can’t see the words clearly without her glasses."
  },
  {
   "en": "bee",
   "pos": "n.",
   "zh": "蜜蜂",
   "ex": "I saw some bees sitting on the flowers in the garden this morning."
  },
  {
   "en": "dead",
   "pos": "adj.",
   "zh": "死的",
   "ex": "Nancy is sad because her pet is dead."
  },
  {
   "en": "lie",
   "pos": "v.",
   "zh": "說謊",
   "ex": "Oliver’s parents were mad at him because he lied to them again."
  },
  {
   "en": "farm",
   "pos": "n.",
   "zh": "農場",
   "ex": "My uncle used to work on a farm."
  },
  {
   "en": "trouble",
   "pos": "n.",
   "zh": "麻煩",
   "ex": "If I don’t get this done before I get off work today, I’ll be in trouble."
  },
  {
   "en": "pain",
   "pos": "n.",
   "zh": "疼痛；痛苦",
   "ex": "The pain in my legs is getting worse."
  },
  {
   "en": "pray",
   "pos": "v.",
   "zh": "祈禱",
   "ex": "Mike is praying for his parents’ health in the church."
  }
 ],
 "5": [
  {
   "en": "foreign",
   "pos": "adj.",
   "zh": "外國的",
   "ex": "Bryan can speak five foreign languages."
  },
  {
   "en": "lollipop",
   "pos": "n.",
   "zh": "棒棒糖",
   "ex": "My brother was happy when I gave him a lollipop."
  },
  {
   "en": "pink",
   "pos": "n.; adj.",
   "zh": "粉紅色（的）",
   "ex": "I wore a pink T-shirt to school yesterday."
  },
  {
   "en": "purple",
   "pos": "n.; adj.",
   "zh": "紫色（的）",
   "ex": "She was dressed in purple."
  },
  {
   "en": "natural",
   "pos": "adj.",
   "zh": "天然的",
   "ex": "This is not Jennie’s natural hair color."
  },
  {
   "en": "center",
   "pos": "n.",
   "zh": "中心；中央",
   "ex": "There is a big sofa in the center of the living room."
  },
  {
   "en": "boss",
   "pos": "n.",
   "zh": "老闆",
   "ex": "Daniel has to ask his boss for a day off."
  },
  {
   "en": "married",
   "pos": "adj.",
   "zh": "已婚的",
   "ex": "Helen and Paul have been married for three years."
  },
  {
   "en": "-sounding",
   "pos": "adj.",
   "zh": "聽起來……的",
   "ex": "A man with a foreign-sounding voice answered the phone."
  },
  {
   "en": "have a sweet tooth",
   "pos": "",
   "zh": "愛吃甜食",
   "ex": "Nisha has a sweet tooth. She loves eating sweets and chocolate."
  },
  {
   "en": "rise",
   "pos": "n.; v.",
   "zh": "上漲；升高",
   "ex": "There was a big rise in the number of COVID-19 cases last week."
  },
  {
   "en": "success",
   "pos": "n.",
   "zh": "成功",
   "ex": "Everyone agreed that the movie was a big success."
  },
  {
   "en": "mark",
   "pos": "n.",
   "zh": "目標；標記",
   "ex": "She made her mark as an actress."
  },
  {
   "en": "belong to",
   "pos": "",
   "zh": "屬於",
   "ex": "The package is not mine. It belongs to Eddie."
  },
  {
   "en": "grown-up",
   "pos": "n.",
   "zh": "大人；成年人",
   "ex": "The boy got lost, so he asked a grown-up for help."
  },
  {
   "en": "leader",
   "pos": "n.",
   "zh": "領導者",
   "ex": "Peter was chosen as the class leader this year."
  },
  {
   "en": "simple",
   "pos": "adj.",
   "zh": "單純的；簡單的",
   "ex": "The rules of the game are quite simple."
  },
  {
   "en": "repeat",
   "pos": "v.",
   "zh": "重複；複誦",
   "ex": "Could you repeat your question, please?"
  },
  {
   "en": "dentist",
   "pos": "n.",
   "zh": "牙醫",
   "ex": "I’m going to the dentist tomorrow morning."
  },
  {
   "en": "knowledge",
   "pos": "n.",
   "zh": "知識",
   "ex": "Iris doesn’t have much knowledge of American history."
  },
  {
   "en": "fail",
   "pos": "v.",
   "zh": "失敗；不及格",
   "ex": "The doctor failed to save the man’s life."
  },
  {
   "en": "deal with",
   "pos": "",
   "zh": "處理",
   "ex": "Could you tell me how you dealt with that problem?"
  },
  {
   "en": "club",
   "pos": "n.",
   "zh": "社團",
   "ex": "Which club do you want to join this year, the movie club or the book club?"
  },
  {
   "en": "popcorn",
   "pos": "n.",
   "zh": "爆米花",
   "ex": "We went to the movies and ate popcorn last night."
  },
  {
   "en": "school fair",
   "pos": "",
   "zh": "園遊會",
   "ex": "Andy had a good time at the school fair yesterday."
  },
  {
   "en": "fulfill",
   "pos": "v.",
   "zh": "執行；實踐",
   "ex": "Bella finally fulfilled her dream of being a teacher."
  },
  {
   "en": "pop",
   "pos": "v.",
   "zh": "爆開",
   "ex": "Chris was sad because his balloon popped."
  }
 ],
 "6": [
  {
   "en": "usual",
   "pos": "adj.",
   "zh": "通常的",
   "ex": "There must be something wrong. Hank didn’t go to school at his usual time."
  },
  {
   "en": "below",
   "pos": "adv.; prep.",
   "zh": "在下面；在……的下面；低於",
   "ex": "The lake is 700 feet below sea level."
  },
  {
   "en": "appear",
   "pos": "v.",
   "zh": "似乎；出現",
   "ex": "It appeared that she didn’t keep my secret."
  },
  {
   "en": "cent",
   "pos": "n.",
   "zh": "分（金錢單位）",
   "ex": "A one-minute phone call to the UK may cost 10 cents."
  },
  {
   "en": "cheat",
   "pos": "v.",
   "zh": "欺騙；作弊",
   "ex": "The bad guy cheated a woman out of her money."
  },
  {
   "en": "waste",
   "pos": "v.; n.",
   "zh": "浪費",
   "ex": "Stop wasting time, guys. We have to finish the report by 10 o’clock."
  },
  {
   "en": "pound (= lb)",
   "pos": "n.",
   "zh": "磅",
   "ex": "I have lost 20 pounds since I started to exercise."
  },
  {
   "en": "peach",
   "pos": "n.",
   "zh": "桃子",
   "ex": "My mother baked some peach pies last weekend."
  },
  {
   "en": "pear",
   "pos": "n.",
   "zh": "梨子",
   "ex": "The pears that my father bought this morning tasted sweet."
  },
  {
   "en": "lemon",
   "pos": "n.",
   "zh": "檸檬",
   "ex": "There was a lemon tree in back of my house."
  },
  {
   "en": "tomato",
   "pos": "n.",
   "zh": "番茄",
   "ex": "Would you like to eat some tomato soup?"
  },
  {
   "en": "pin",
   "pos": "n.",
   "zh": "大頭針；別針",
   "ex": "It was so quiet there that you could hear a pin drop."
  },
  {
   "en": "superglue",
   "pos": "n.",
   "zh": "三秒膠",
   "ex": "You can fix the broken toy with superglue."
  },
  {
   "en": "paste",
   "pos": "n.",
   "zh": "漿糊；v. 黏貼",
   "ex": "Fred bought some markers and paste for his art class."
  },
  {
   "en": "jump rope",
   "pos": "n.; v.",
   "zh": "跳繩",
   "ex": "I used to play jump rope with my sisters after school."
  },
  {
   "en": "marker",
   "pos": "n.",
   "zh": "麥克筆",
   "ex": "The kid is drawing with many different colored markers."
  },
  {
   "en": "paint",
   "pos": "n.",
   "zh": "顏料；油漆；v.（用顏料）畫",
   "ex": "Keep away from the table. The sign says “Wet Paint.”"
  },
  {
   "en": "total",
   "pos": "n.; adj.",
   "zh": "總數（的）",
   "ex": "The total cost of the plan came to five million NT dollars."
  },
  {
   "en": "product",
   "pos": "n.",
   "zh": "產品",
   "ex": "I don’t buy products which have been tested on animals."
  },
  {
   "en": "sample",
   "pos": "n.",
   "zh": "樣品",
   "ex": "They gave me some free cheese samples."
  },
  {
   "en": "honey",
   "pos": "n.",
   "zh": "蜂蜜",
   "ex": "Honey can be used to treat a sore throat."
  },
  {
   "en": "centimeter (= cm)",
   "pos": "n.",
   "zh": "公分",
   "ex": "The walls are thirty centimeters thick."
  },
  {
   "en": "height",
   "pos": "n.",
   "zh": "高度",
   "ex": "Matt is about the same height as his brother."
  },
  {
   "en": "therefore",
   "pos": "adv.",
   "zh": "因此",
   "ex": "The shoes are lighter and softer. Therefore, they are more comfortable to wear."
  },
  {
   "en": "shopkeeper",
   "pos": "n.",
   "zh": "店主",
   "ex": "The shopkeeper usually closes his shop at 10 p.m."
  },
  {
   "en": "come to think of it",
   "pos": "",
   "zh": "這樣一想",
   "ex": "Come to think of it, I know someone who can help."
  },
  {
   "en": "level",
   "pos": "n.",
   "zh": "高度；程度",
   "ex": "The picture was hung on the wall at eye level."
  },
  {
   "en": "sight",
   "pos": "n.",
   "zh": "所見之物",
   "ex": "Sharon waved until the car was out of sight."
  }
 ]
};
