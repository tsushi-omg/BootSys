
//#region PGID

//========================================
// ワーク
//========================================
const WORK_DAILY = "WORK_DAILY";    // デイリー記録
const WORK_TASK = "WORK_TASK";      // タスク管理
const WORK_FLOW = "WORK_FLOW";      // フローチャート
const WORK_MEMO = "WORK_MEMO";      // 雑多メモ
const WORK_PGVIEWER = "WORK_PGVIEWER";      //PGビューアー
const WORK_TOOLMANAGER = "WORK_TOOLMANAGER";    // ツール管理
const WORK_LINK = "WORK_LINK";      // 外部リンク

//========================================
// リソース
//========================================
const MASTER_PGCATEGORY = "MASTER_PGCATEGORY";      // プログラム分類
const MASTER_PGINFO = "MASTER_PGINFO";              // プログラム情報
const MASTER_WORKCATEGORY = "MASTER_WORKCATEGORY";  // 作業カテゴリ
const MASTER_TAGMANAGER = "MASTER_TAGMANAGER";      // タグ管理
const MASTER_SETTING = "MASTER_SETTING";            // 設定

//========================================
// AI
//========================================
const AI_AGENCY = "AI_AGENCY";                      // システム代行

//========================================
// 開発用
//========================================
let debug = false;
// debug = true;

//========================================
// クイックダウンロード
//========================================
document.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.key === "s" || e.ctrlKey && e.key === "S") {
        e.preventDefault();
        // navigator.clipboard.writeText(JSON.stringify(mainData, null, 2)).then(() => {
        //     alert("コピーしました");
        // });
        downLoadJSON();
    }
});


//#region パブリック変数

//========================================
// メインデータ
//========================================
let DATABASE = 
{
    "WORK": [
        {
            //*** タスク管理*************************************** /
            WORK_TASK:[
                // {
                //     "addedDate":"",
                //     "workCategory":"",
                //     "pgInfo":"",
                //     "pgObjId":"",
                //     "content":"",
                //     "dueDate":"",
                //     "progress":"",
                //     "actHours":"",
                //     "compDate":"",
                //     "memos":[ {id, title, value}, {}],
                // }
            ],
            //*** 雑多メモ*************************************** /
            WORK_MEMO:[
            //    {
            //         "type": obj["type"],
            //         "name": name,
            //         "content":"",
            //         "id": objId,
            //         "parentCSV": container.name,
            //         "sortNo":0,
            //     },
            ],
            //*** ツール管理*************************************** /
            WORK_TOOLMANAGER:[
                // id, name, code, memo
            ],
        }
    ],
    "MASTER": [
        // これが一つのオブジェクトとして配列のindex=0となっている
        {
            //*** プログラム分類*************************************** /
            MASTER_PGCATEGORY:[
                {"kaisoCount": 2},
                {"kaiso1":[]},
                {"kaiso2":[]},
                // {"kaiso1":[
                //     {"id":1, "name": "予算示達"},
                //     {"id":2, "name": "会計業務"},
                // ]},
                // {"kaiso2":[
                //     {"kaiso1ID":1, "id":1, "name": "予算示達"},
                //     {"kaiso1ID":1, "id":2, "name": "会計業務"},
                // ]},
                // {"kaiso3":[
                //     {"kaiso1ID":1,"kaiso2ID":1, "id":1, "name": "予算示達"},
                //     {"kaiso1ID":1,"kaiso2ID":1,"id":2, "name": "会計業務"},
                // ]},// ...
            ],
            //*** プログラム情報*************************************** /
            MASTER_PGINFO:[
                
            ],
            //*** 作業カテゴリ*************************************** /
            MASTER_WORKCATEGORY:[
                // {"id":1, "name":"abc"}, {"id":2, "name":"def"},
            ],
            //*** タグ管理*************************************** /
            MASTER_TAGMANAGER:[
                // {"id":1, "name":"abc"}, {"id":2, "name":"def"},
            ],
        }
    ],
    "AI": [
        {
            //*** システム代行*************************************** /
            AI_AGENCY:[
            ],
        }
    ],
    "META": [
        {
            // プロジェクト名
            "PROJECTNAME":"",
        }
    ],
};

var logText = ""; // ログ書き溜め用変数




//#region アイコン用SVG　（#F3F3F3、size: 24）
const svg_sheet = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg>`
const svg_android = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M40-240q9-107 65.5-197T256-580l-74-128q-6-9-3-19t13-15q8-5 18-2t16 12l74 128q86-36 180-36t180 36l74-128q6-9 16-12t18 2q10 5 13 15t-3 19l-74 128q94 53 150.5 143T920-240H40Zm240-110q21 0 35.5-14.5T330-400q0-21-14.5-35.5T280-450q-21 0-35.5 14.5T230-400q0 21 14.5 35.5T280-350Zm400 0q21 0 35.5-14.5T730-400q0-21-14.5-35.5T680-450q-21 0-35.5 14.5T630-400q0 21 14.5 35.5T680-350Z"/></svg>`;
const svg_tag = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h440q19 0 36 8.5t28 23.5l216 288-216 288q-11 15-28 23.5t-36 8.5H160Zm0-80h440l180-240-180-240H160v480Zm220-240Z"/></svg>`;
const svg_calendar = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg>';
const svg_task = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z"/></svg>`;
const svg_task_gray = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z"/></svg>`;
const svg_task_color2 = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#61a6dfff"><path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z"/></svg>`;
const svg_category = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="m260-520 220-360 220 360H260ZM700-80q-75 0-127.5-52.5T520-260q0-75 52.5-127.5T700-440q75 0 127.5 52.5T880-260q0 75-52.5 127.5T700-80Zm-580-20v-320h320v320H120Zm580-60q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm-500-20h160v-160H200v160Zm202-420h156l-78-126-78 126Zm78 0ZM360-340Zm340 80Z"/></svg>`;
const svg_info = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`;
const svg_category2 = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z"/></svg>`;
const svg_memo = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M280-280h84l240-238-86-86-238 238v86Zm352-266 42-44q6-6 6-14t-6-14l-56-56q-6-6-14-6t-14 6l-44 42 86 86ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm280-590q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z"/></svg>`
const svg_memo_gray = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M280-280h84l240-238-86-86-238 238v86Zm352-266 42-44q6-6 6-14t-6-14l-56-56q-6-6-14-6t-14 6l-44 42 86 86ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm280-590q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z"/></svg>`
const svg_link = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/></svg>`;
const svg_setting = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>`;
const svg_map = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M640-560v-126 126ZM174-132q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v337q-15-23-35.5-42T760-528v-204l-120 46v126q-21 0-41 3.5T560-546v-140l-160-56v523l-226 87Zm26-96 120-46v-468l-120 40v474Zm440-12q34 0 56.5-20t23.5-60q1-34-22.5-57T640-400q-34 0-57 23t-23 57q0 34 23 57t57 23Zm0 80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 43.5T778-238l102 102-56 56-102-102q-18 11-38.5 16.5T640-160ZM320-742v468-468Z"/></svg>`;
const svg_edit = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M560-80v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T903-300L683-80H560Zm300-263-37-37 37 37ZM620-140h38l121-122-18-19-19-18-122 121v38ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v120h-80v-80H520v-200H240v640h240v80H240Zm280-400Zm241 199-19-18 37 37-18-19Z"/></svg>`;
const svg_edit_color2 = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#61a6dfff"><path d="M560-80v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T903-300L683-80H560Zm300-263-37-37 37 37ZM620-140h38l121-122-18-19-19-18-122 121v38ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v120h-80v-80H520v-200H240v640h240v80H240Zm280-400Zm241 199-19-18 37 37-18-19Z"/></svg>`;
const svg_edit_gray = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M560-80v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T903-300L683-80H560Zm300-263-37-37 37 37ZM620-140h38l121-122-18-19-19-18-122 121v38ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v120h-80v-80H520v-200H240v640h240v80H240Zm280-400Zm241 199-19-18 37 37-18-19Z"/></svg>`;
const svg_brain = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M440-400h80v-280h-80v280Zm120-60h80v-180h-80v180Zm-240-20h80v-160h-80v160ZM240-80v-172q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v80h-80v-160h160v-200h108l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v208h-80Zm254-360Z"/></svg>`;
const svg_shapes2 = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#61a6dfff"><path d="M600-360ZM320-242q10 1 19.5 1.5t20.5.5q11 0 20.5-.5T400-242v82h400v-400h-82q1-10 1.5-19.5t.5-20.5q0-11-.5-20.5T718-640h82q33 0 56.5 23.5T880-560v400q0 33-23.5 56.5T800-80H400q-33 0-56.5-23.5T320-160v-82Zm40-78q-117 0-198.5-81.5T80-600q0-117 81.5-198.5T360-880q117 0 198.5 81.5T640-600q0 117-81.5 198.5T360-320Zm0-80q83 0 141.5-58.5T560-600q0-83-58.5-141.5T360-800q-83 0-141.5 58.5T160-600q0 83 58.5 141.5T360-400Zm0-200Z"/></svg>`;
const svg_square2 = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#61a6dfff"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0 0v-560 560Z"/></svg>`;
const svg_circle2 = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#61a6dfff"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`;
const svg_card2 = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#61a6dfff"><path d="M200-280h560v-80H200v80Zm0-160h560v-80H200v80Zm0-160h400v-80H200v80Zm-40 440q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"/></svg>`;
const svg_folder = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/></svg>`;
const svg_folder_black = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#383838ff"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/></svg>`;
const svg_file = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg>`;
const svg_file_black = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#383838ff"><path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg>`;
const svg_gabage = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>`;
const svg_pencil = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>`;
const svg_lock = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>`;
const svg_code = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z"/></svg>`;
const svg_spanner = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="m620-284 56-56q6-6 6-14t-6-14L540-505q4-11 6-22t2-25q0-57-40.5-97.5T410-690q-17 0-34 4.5T343-673l94 94-56 56-94-94q-8 16-12.5 33t-4.5 34q0 57 40.5 97.5T408-412q13 0 24.5-2t22.5-6l137 136q6 6 14 6t14-6ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`;
const svg_spanner_gray = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#383838ff"><path d="m620-284 56-56q6-6 6-14t-6-14L540-505q4-11 6-22t2-25q0-57-40.5-97.5T410-690q-17 0-34 4.5T343-673l94 94-56 56-94-94q-8 16-12.5 33t-4.5 34q0 57 40.5 97.5T408-412q13 0 24.5-2t22.5-6l137 136q6 6 14 6t14-6ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`;
const svg_play_gray = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`;
const svg_CrossWord = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M400-160h160v-160H400v160ZM160-400h160v-160H160v160Zm240 0h160v-160H400v160Zm240 0h160v-160H640v160Zm0-240h160v-160H640v160ZM320-80v-240H80v-320h480v-240h320v560H640v240H320Z"/></svg>`;
const svg_CrossWord_gray = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M400-160h160v-160H400v160ZM160-400h160v-160H160v160Zm240 0h160v-160H400v160Zm240 0h160v-160H640v160Zm0-240h160v-160H640v160ZM320-80v-240H80v-320h480v-240h320v560H640v240H320Z"/></svg>`;
const svg_magnet= `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M480-80q-83 0-141.5-58.5T280-280q0-83 58.5-141.5T480-480q83 0 141.5 58.5T680-280q0 83-58.5 141.5T480-80Zm0-80q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM280-474 80-674q80-80 183.5-123T480-840q113 0 216.5 43T880-674L680-474q-41-41-92-63.5T480-560q-57 0-108 22.5T280-474Zm6-106q42-30 91.5-45T480-640q53 0 101.5 14.5T674-582l88-88q-62-44-133.5-67T480-760q-77 0-148.5 23T198-670l88 90Zm194-60Zm0 360Z"/></svg>`;
const svg_close_gray = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1E124A"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`
const svg_robot_blue = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#3B82F6"><path d="M160-360q-50 0-85-35t-35-85q0-50 35-85t85-35v-80q0-33 23.5-56.5T240-760h120q0-50 35-85t85-35q50 0 85 35t35 85h120q33 0 56.5 23.5T800-680v80q50 0 85 35t35 85q0 50-35 85t-85 35v160q0 33-23.5 56.5T720-120H240q-33 0-56.5-23.5T160-200v-160Zm200-80q25 0 42.5-17.5T420-500q0-25-17.5-42.5T360-560q-25 0-42.5 17.5T300-500q0 25 17.5 42.5T360-440Zm240 0q25 0 42.5-17.5T660-500q0-25-17.5-42.5T600-560q-25 0-42.5 17.5T540-500q0 25 17.5 42.5T600-440ZM320-280h320v-80H320v80Zm-80 80h480v-480H240v480Zm240-240Z"/></svg>`;
const svg_leg_blue = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3B82F6"><path d="M260-840q-45 0-72.5 50T160-680q0 63 17.5 111.5T210-496l110-22q13-32 26.5-73t13.5-89q0-60-27.5-110T260-840Zm55 520q19 0 32-14t13-39q0-17-8-35t-16-32l-96 20q0 40 17.5 70t57.5 30Zm385-320q-45 0-72.5 50T600-480q0 48 13.5 88.5T640-318l110 22q15-24 32.5-72T800-480q0-60-27.5-110T700-640Zm-55 520q40 0 57.5-30t17.5-70l-96-20q-8 14-16 32t-8 35q0 20 12.5 36.5T645-120ZM315-240q-77 0-117-57t-38-128l-18-27q-11-17-36.5-77T80-680q0-103 51-171.5T260-920q85 0 132.5 75.5T440-680q0 58-16 107t-28 79l8 13q8 14 22 44.5t14 63.5q0 57-35.5 95T315-240ZM645-40q-54 0-89.5-38T520-173q0-33 14-63.5t22-44.5l8-13q-12-30-28-79t-16-107q0-89 47.5-164.5T700-720q78 0 129 68.5T880-480q0 91-25.5 150.5T818-253l-18 28q1 71-38.5 128T645-40Z"/></svg>`;
const svg_agent_white = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F3F3F3"><path d="M440-120v-80h320v-284q0-117-81.5-198.5T480-764q-117 0-198.5 81.5T200-484v244h-40q-33 0-56.5-23.5T80-320v-80q0-21 10.5-39.5T120-469l3-53q8-68 39.5-126t79-101q47.5-43 109-67T480-840q68 0 129 24t109 66.5Q766-707 797-649t40 126l3 52q19 9 29.5 27t10.5 38v92q0 20-10.5 38T840-249v49q0 33-23.5 56.5T760-120H440Zm-80-280q-17 0-28.5-11.5T320-440q0-17 11.5-28.5T360-480q17 0 28.5 11.5T400-440q0 17-11.5 28.5T360-400Zm240 0q-17 0-28.5-11.5T560-440q0-17 11.5-28.5T600-480q17 0 28.5 11.5T640-440q0 17-11.5 28.5T600-400Zm-359-62q-7-106 64-182t177-76q89 0 156.5 56.5T720-519q-91-1-167.5-49T435-698q-16 80-67.5 142.5T241-462Z"/></svg>`;


//#region 共通関数

//======================================================================================================================
// メニュー構築（２階層まで。別メニューの名前がまるごと入るのはNG。名前をキーにindexOf検索してフォーカスしているため）
//======================================================================================================================
let menuData = {};

const menuItemsContainer = document.getElementById("menuItemsContainer");
const tabContainer = document.getElementById("tabContainer");

function buildMenu(){

    // clear
    tabContainer.innerHTML = "";
    menuItemsContainer.innerHTML = "";

    for(let target of menuData["1stMenu"]){
        // 1stメニュー
        const parentContainer = document.createElement("div");
        const parentButton = document.createElement("button");
        {
            parentButton.textContent = target.name;
            parentButton.style.userSelect = "none";
            // 開閉
            parentButton.addEventListener("click",function toggleChildrenVisible(){
                for(var child of parentContainer.children){
                    if(child != this){
                        child.hidden = !child.hidden;
                    }
                }
            })
        }
        parentContainer.appendChild(parentButton);
        menuItemsContainer.appendChild(parentContainer);
        for(let target2 of target["nextMenu"]){
            // 2ndメニュー
            const parentContainer2 = document.createElement("div");
            const parentButton2 = document.createElement("button");
            const icon = document.createElement("span");
            const buttonName = target2.name;
            const buttonId = target2.id;
            {
                parentButton2.textContent = buttonName;
                parentContainer2.style.marginLeft = "15px";
                icon.innerHTML = target2.icon;
                parentButton2.classList.add("iconButton");
                // 初期表示
                // parentContainer2.hidden = true;
                parentButton2.style.userSelect = "none";
                // メニュークリックイベント
                parentButton2.addEventListener("click", function(event){
                    // タブ作成
                    var createTab = true;
                    for(var tmpElement of tabContainer.children){
                        if(tmpElement.textContent.indexOf(buttonName) != -1) createTab = false;
                    }
                    if(createTab){
                        const tabButton = document.createElement("button")
                        const tabCloseButton = document.createElement("button")
                        tabButton.textContent = buttonName;
                        tabCloseButton.textContent = "×";
                        tabCloseButton.classList.add("tabCloseButton");
                        tabButton.appendChild(tabCloseButton);
                        tabContainer.appendChild(tabButton);
                        tabButton.addEventListener("click", function(){
                            // タブアクティブ
                            for(var tabItem of tabContainer.children){
                                if(tabItem.classList.contains("active")) {
                                    tabItem.classList.remove("active")
                                    // 閉じるボタン
                                    tabItem.children[0].classList.remove("activeTabClose")
                                };
                            }
                            if(tabButton.classList.contains("active")){
                                tabButton.classList.remove("active")
                                tabCloseButton.classList.remove("activeTabClose")
                            }else{
                                tabButton.classList.add("active")
                                tabCloseButton.classList.add("activeTabClose")
                            }
                            tabCloseButton.style.backgroundColor = tabButton.style.backgroundColor;
                            // 画面open
                            openThisPanel()

                            // alert("タブボタンクリック発火")
                        })
                        // タブ閉じるボタン
                        tabCloseButton.addEventListener("click", function(e){
                            e.stopPropagation();
                            this.parentElement.remove();
                            // アクティブパネルの閉じるボタンなら、（ほかにタブがあれば先頭のタブを開き、なければパネルクローズ）
                        })
                        // tabButton.dispatchEvent(new MouseEvent("click"));
                        {
                            // タブアクティブ
                            for(var tabItem of tabContainer.children){
                                if(tabItem.classList.contains("active")) {
                                    tabItem.classList.remove("active")
                                    // 閉じるボタン
                                    tabItem.children[0].classList.remove("activeTabClose")
                                };
                            }
                            if(tabButton.classList.contains("active")){
                                tabButton.classList.remove("active")
                                tabCloseButton.classList.remove("activeTabClose")
                            }else{
                                tabButton.classList.add("active")
                                tabCloseButton.classList.add("activeTabClose")
                            }
                            tabCloseButton.style.backgroundColor = tabButton.style.backgroundColor;
                        }
                    }else{
                        // すでにある場合はクリックイベントディスパッチ
                        for(var tmpElement of tabContainer.children){
                            if(tmpElement.textContent.indexOf(buttonName) != -1) {
                                tmpElement.dispatchEvent(new MouseEvent("click"));
                                break;
                            };
                        }
                    }
                    // 画面open
                    function openThisPanel(){
                        for(var panel of document.getElementsByClassName("tab-panel")){
                            if(panel.classList.contains("active")){
                                panel.classList.remove("active")
                            }
                        }
                        try{ document.getElementById(`${buttonId}_PANEL`).classList.add("active"); }catch(e){}
                        
                        // 実行
                        if (target2.bootSys != null) {
                            // isFirst = false;
                            target2.bootSys(false);
                        }
                    }
                    openThisPanel();
                    // alert("メニュークリック発火")
                    
                })
            }
            // アイコン
            parentButton2.prepend(icon);
            parentContainer2.appendChild(parentButton2);
            parentContainer.appendChild(parentContainer2);
        }
    }
}

//========================================
// キーが押されているかどうかの判定**
//========================================

// キーダウンbool値　※押下ごとにキー追加
let pressedKeys = {};

// キーダウン　bool値
document.addEventListener("keydown", function(e){
    pressedKeys[e.key] = true;
})

// キーアップ
document.addEventListener("keyup", function(e){
    pressedKeys[e.key] = false;
})

// キーが押されているかどうかの判定**
function keydown(keyName){
    return pressedKeys[keyName];
}

//========================================
// ログ出力
//========================================
const appLog = document.getElementById("appLog");
function log(message){
    // 現在年月日時分秒
    const now = new Date(); 
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    message = `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}] ${message}`;
    appLog.value += `
${message}`;
    appLog.scrollTop = appLog.scrollHeight;
    logText = "";
}

//========================================
// 整形されたJSON出力
//========================================
function writeDataLog(){
    log(`
${JSON.stringify(DATABASE, null, 2)}`)
}

//========================================
// ログ開閉
//========================================
function toggleLogsVisible(){
    appLog.hidden = !appLog.hidden;
}

//======================================================================================================================
// 20桁ランダム英数字種痘（ランダム英数） 指定した配列内オブジェクトのプロパティ"id"を見て一意生成
//======================================================================================================================
function getRandomString20(repo=null){
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 20; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars.charAt(randomIndex);
    }
    if(repo==null) return result;
    var useAble = true;
    for(let obj of repo){
        try{
            if(obj["id"]==result) {
                useAble = false;
                break;
            }
        }catch(e){}
    }
    if(useAble) return result;
    else return getRandomString20(repo);
}

//========================================
// 簡略化用関数（getElementByID）
//========================================
function getDOM(targetID, byName = false){
    if(byName){
        try{
            return document.getElementsByName(targetID)[0];
        }catch(e){}
    }
    return document.getElementById(targetID);
}

//========================================
// 簡略化用関数（createElement）
//========================================
function createDOM(type){
    return document.createElement(type);
}

//========================================
// valueをクリア
//========================================
function clearValue(DOMIDsCSV){
    for(let domid of DOMIDsCSV.split(',')){
        if(domid != "") getDOM(domid).value = "";
    }
}

//========================================
// マウス位置取得
//========================================
var mouseX = 0;
var mouseY = 0;
document.addEventListener("mousemove", function(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
});

//========================================
// 正確なポジション取得
//========================================
function getPosition(e, parent){
    const rect = parent.getBoundingClientRect();
    const x = e.clientX - rect.left + parent.scrollLeft;
    const y = e.clientY - rect.top  + parent.scrollTop;
    return { x, y };
}

//========================================
// JSONファイル作成＆ダウンロード
//========================================
function downLoadJSON(){
    if (!DATABASE || typeof DATABASE !== "object") {
        alert("エクスポートするデータがありません。");
        return;
    }

    const now = new Date(); 
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    var dayTime = `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]`;

    const dataStr = JSON.stringify(DATABASE, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BootSys_${DATABASE.META[0].PROJECTNAME ? "[" + DATABASE.META[0].PROJECTNAME + "]_" : ""}${dayTime}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    log("JSONファイルの作成に成功しました")
}

//========================================
// JSONファイル読込
//========================================
const JSONReader = document.getElementById("JSONReader");
JSONReader.addEventListener("change", function(event){
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
    try {
        const json = JSON.parse(e.target.result);
        if(confirm("現在の編集を破棄して、JSONデータを読み込みますか？")){
            DATABASE = json;
            document.getElementById("PNameBox").value = DATABASE.META[0].PROJECTNAME;
            // マックス階層
            openMaxKaiso = DATABASE.MASTER[0].MASTER_PGCATEGORY.find(a => a.hasOwnProperty("kaisoCount")).kaisoCount;
            alert("データの読み込みが完了しました")
            log("JSONデータの読み込みに成功しました")
            // 既存データパッチ
            applyPatch();
            {
                // マスタデータの絡まない画面はopen時にリビルドしない仕様のため手動でリビルド
                bootSys_WORK_MEMO(false, true); // 雑多メモ
            }
        }else{
            JSONReader.value = "";
        }

    } catch (err) {
        alert("JSONファイルの読み込みに失敗しました: " + err);
    }
    };
    reader.readAsText(file);
})

//========================================
// 既存データパッチ**
//========================================
function applyPatch(){
    try{
        
        let msg = false;

        // 雑多メモデータ領域
        if (!DATABASE.WORK[0].hasOwnProperty("WORK_MEMO")) {
            DATABASE.WORK[0].WORK_MEMO = []; 
            log("パッチが適用されました [雑多メモ：データ領域を作成]");
        }

        // 雑多メモデータ　ステータスアイコンデータ領域
        msg = false
        for(let obj of DATABASE.WORK[0].WORK_MEMO){
            if(! (obj.hasOwnProperty("statusIcon"))){
                obj["statusIcon"] = null;
                msg = true;
            }
        }
        if(msg) log("パッチが適用されました [雑多メモ：ステータスアイコンデータを作成]");

        // ツール管理データ領域
        if (!DATABASE.WORK[0].hasOwnProperty("WORK_TOOLMANAGER")) {
            DATABASE.WORK[0].WORK_TOOLMANAGER = []; 
            log("パッチが適用されました [ツール管理：データ領域を作成]");
        }

        // AIメニュー　データ領域
        if (!DATABASE.hasOwnProperty("AI")) {
            DATABASE.AI = [{}]; 
            log("パッチが適用されました [AI：データ領域を作成]");
        }

        // システム代行データ領域
        if (!DATABASE.AI[0].hasOwnProperty(AI_AGENCY)) {
            DATABASE.AI[0].AI_AGENCY = []; 
            log("パッチが適用されました [システム代行：データ領域を作成]");
        }
        
    }catch(e){alert("パッチ適用に失敗しました")}

}

//========================================
// 表示切替
//========================================
function toggleVisible(DOMID){
    var target = document.getElementById(DOMID);
    target.hidden = !target.hidden;
}

//========================================
// タスク管理　登録フォーム表示切替
//========================================
function toggleVisible_TaskManager(){
    const registerForm = getDOM("register-form-taskManager");
    const tableForm = getDOM("table-container-task-manager");
    registerForm.hidden = !registerForm.hidden;
    if(registerForm.hidden){
        tableForm.style.height = "61vh";
    }else{
        tableForm.style.height = "40vh";
    }
}
//====================
// 終了時に確認
//====================
window.addEventListener('beforeunload', function(event) {
    if(!debug)
    event.preventDefault(); // デフォルト動作を防ぐ（必須）
    event.returnValue = ""; // これを設定しないと動かない（固定メッセージ）
});

//====================
// ログ拡大
//====================
appLog.addEventListener("dblclick", function(){
    const logClone = document.createElement("textarea");
    const modal = document.createElement("div");
    {
        logClone.style = appLog.style;
        logClone.style.position="absolute";
        logClone.style.top = "20vh";
        logClone.style.left = "10vw";
        logClone.style.height = "60vh";
        logClone.style.width = "80vw";
        // logClone.value = appLog.value;
        logClone.value = JSON.stringify(DATABASE, null, 2);
        logClone.style.zIndex = 110;
        logClone.spellcheck = "off";
    }
    {
        modal.style.position="absolute";
        modal.style.top = "0vh";
        modal.style.left = "0vw";
        modal.style.height = "100vh";
        modal.style.width = "100vw";
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        modal.style.zIndex = 100;
        modal.addEventListener("click", function(){
            try{
                logClone.remove();
                this.remove();
            }catch(e){}
        })
    }
    document.body.appendChild(modal);
    document.body.appendChild(logClone);
    logClone.scrollTop = logClone.scrollHeight;
})

//========================================
// Update PJ Name
//========================================
const PNameBox = document.getElementById("PNameBox");
PNameBox.addEventListener("change", function(){
    DATABASE.META[0].PROJECTNAME = this.value.trim();
    log(`プロジェクト名を [${this.value.trim()}] に変更しました`)
})

//========================================
// マウスドラッグ（shift）
//========================================
function mouseDrag(element) {
    element.onpointermove = function(event) {
        // 要素のサイズを取得
        const elementRect = this.getBoundingClientRect();
        // 右から20pxの範囲内にマウスがあるか確認
        if (event.clientX > elementRect.right - 20) {
            // 右端20pxはドラッグを無効にする
            return;
        }
        if (event.buttons && keydown("Shift")) {
            this.style.left     = this.offsetLeft + event.movementX + 'px';
            this.style.top      = this.offsetTop  + event.movementY + 'px';
            this.style.position = 'absolute';
            this.draggable      = false;
            this.setPointerCapture(event.pointerId);
        }
    };
}
//==================================================
// enterで指定DOMにフォーカス（列挙順、shftで戻し）
//==================================================
function setupNextFocus(domArr){
    let arr = domArr;
    let index = 0;
    for(let el of arr){
        // index
        let nextIdx = index != arr.length-1 ? index + 1 : null;
        let prevIdx = index != 0 ? index - 1 : null;
        // next
        if(nextIdx != null){
            el.addEventListener("keydown", function(e){
                if(e.key == "Enter"){
                    // e.preventDefault();
                    arr[nextIdx].focus()
                }
            })
        }
        // prev
        if(prevIdx != null){
            el.addEventListener("keydown", function(e){
                if(e.key == "Enter" && e.shiftKey){
                    // e.preventDefault();
                    arr[prevIdx].focus()
                }
            })
        }
        index++;
    }
}
//==================================================
// 対象の残タスク数を数値返却
//==================================================
function getTaskCount(kbn, objId){
    let taskCount = 0;
    switch(kbn){

        // 階層
        case "KAISO":
            for(let taskObj of DATABASE.WORK[0].WORK_TASK){
                // 進捗率100未満のみ対象
                if(parseInt(taskObj["progress"]) == 100) continue;
                let tmpPgObj = DATABASE.MASTER[0].MASTER_PGINFO
                                    .find(a => a["id"] == taskObj["pgObjId"]);
                // 階層IDをパスに含む、未完了タスクのPGID
                if(tmpPgObj && tmpPgObj["kaisoCSV"].includes(objId)) taskCount++;
            }
        break;

        // PG
        case "PG":
            for(let taskObj of DATABASE.WORK[0].WORK_TASK){
                // 進捗率100未満のみ対象
                if(parseInt(taskObj["progress"]) == 100) continue;
                if(taskObj["pgObjId"] == objId) taskCount++;
            }
        break;
    }
    return taskCount;
}

//========================================================
// 自動操作ロボ（クリック対象のDOMId配列、総処理時間ms）
// イベント名
// 追加オーダー
// 例）{textBoxId:"dblckick"}
//========================================================
function moveRobot(robot, toX, toY, duration = 300){
    return new Promise(resolve => {
        robot.style.transition = `left ${duration}ms linear, top ${duration}ms linear`;
        robot.style.left = toX + "px";
        robot.style.top  = toY + "px";
        setTimeout(resolve, duration);
    });
}

async function bootMini_autoRobo(arr, allTime, eventNameCSV = "click", order = null){

    const robot = createDOM("span");
    robot.classList.add("robot");
    robot.style.fontSize = "25px"
    // robot.innerHTML = svg_robot_blue;
    robot.innerHTML = "🫵🏻";
    document.body.appendChild(robot);

    // INIT
    robot.style.top  = mouseX + "px";
    robot.style.left = mouseY + "px";

    // PROGRESS
    // let container = createDOM("div");
    // container.classList.add("auto-move-progress-container");
    // for(let domId of arr){
    //     // BLOCK
    //     const block = createDOM("span");
    //     block.innerHTML = svg_leg_blue;
    //     block.id = domId + "auto_progress";
    //     container.appendChild(block)
    // }
    // document.body.appendChild(container);

    const partTime = allTime / arr.length;

    for(let domId of arr){

        let tmpEventNameCSV = eventNameCSV;

        const el = getDOM(domId);

        if(!el) continue;

        // EVENT ORDER
        if(order && order[domId]) tmpEventNameCSV = order[domId];

        // // ACTIVE LOG
        // log(`auto ${tmpEventNameCSV} [${el.textContent}]`)

        const rect = el.getBoundingClientRect();

        await moveRobot(
            robot,
            rect.left + rect.width / 2,
            rect.top  + rect.height / 2,
            partTime
        );

        for(let eventName of tmpEventNameCSV.split(",")){
            el.dispatchEvent(new MouseEvent(eventName, { bubbles:true }));
        }

        // PROGRES
        // getDOM(domId + "auto_progress").remove();

        await new Promise(r => setTimeout(r, 150));
    }

    robot.remove();
}

//========================================
// 階層CSV➤階層名称パスへ変換
//========================================
function kaisoCSVToPath(pKaisoCSV){
    let kaisoIndex = 1;
    let path = "";
    for(let kaisoId of pKaisoCSV.split(",")){
        let kaisoKey = `kaiso${kaisoIndex}`;
        path += (path ? "> " : "") + DATABASE.MASTER[0].MASTER_PGCATEGORY
                .find(a => a[kaisoKey])[kaisoKey]
                .find(b => b["id"] == kaisoId)["name"];
        kaisoIndex++;
    }
    return path;
}

//========================================
// 階層オブジェクト➤階層名称パスへ変換
//========================================
function kaisoObjToPath(pKaisoObj, pKaisoIndex){
    let path = "";
    for(let kaisoIndex = 1; kaisoIndex < pKaisoIndex; kaisoIndex++){
        let kaisoKey = `kaiso${kaisoIndex}`
        path += (path ? "> " : "") + DATABASE.MASTER[0].MASTER_PGCATEGORY
                .find(a => a[kaisoKey])[kaisoKey]
                .find(b => b["id"] == pKaisoObj[kaisoKey + "ID"])["name"];
    }
    return path;
}

//========================================
// 複数マッチ判定
//========================================
function multiMatch(targetString, valueCSV){
    for(let val of valueCSV.split(",")){
        if(targetString.includes(val)) return true;
    }
    return false;
}

//========================================
// 共通使用変数
//========================================
function getTime(){
    let now = new Date();
    let time = now.toTimeString().slice(0,5);
    return time;
}
// type="date"と同じ
function getToday(){
    let now = new Date();
    let today = now.toISOString().split("T")[0];
    return today;
}

//========================================
// 高度な編集機能を提供
//========================================
function attachRichEditFunction(textarea) {

    textarea.spellcheck = false;

    textarea.addEventListener("keydown", function (e) {

        const start = textarea.selectionStart;
        const end   = textarea.selectionEnd;
        const value = textarea.value;

        // =========================
        // TAB / Shift+TAB
        // =========================
        if (e.key === "Tab") {
            e.preventDefault();

            // 選択なし
            if (start === end) {
                textarea.value =
                    value.slice(0, start) +
                    "    " +
                    value.slice(end);
                textarea.selectionStart =
                textarea.selectionEnd = start + 4;
                return;
            }

            // 複数行選択
            const selected = value.slice(start, end);
            const lines = selected.split("\n");

            if (e.shiftKey) {
                // インデント解除
                const newLines = lines.map(l =>
                    l.startsWith("    ") ? l.slice(4) : l
                );
                textarea.value =
                    value.slice(0, start) +
                    newLines.join("\n") +
                    value.slice(end);
            } else {
                // インデント追加
                const newLines = lines.map(l => "    " + l);
                textarea.value =
                    value.slice(0, start) +
                    newLines.join("\n") +
                    value.slice(end);
            }

            textarea.selectionStart = start;
            textarea.selectionEnd =
                start + textarea.value.slice(start).length;
            return;
        }

        // =========================
        // ENTER（インデント継承）
        // =========================
        if (e.key === "Enter") {
            e.preventDefault();

            const lineStart =
                value.lastIndexOf("\n", start - 1) + 1;
            const indent =
                value.slice(lineStart, start).match(/^\s*/)[0];

            textarea.value =
                value.slice(0, start) +
                "\n" + indent +
                value.slice(end);

            textarea.selectionStart =
            textarea.selectionEnd = start + 1 + indent.length;
            return;
        }

        // =========================
        // 自動ペア補完
        // =========================
        const pairs = {
            "{": "}",
            "(": ")",
            "[": "]",
            "\"": "\"",
            "'": "'"
        };

        if (pairs[e.key]) {
            e.preventDefault();

            textarea.value =
                value.slice(0, start) +
                e.key + pairs[e.key] +
                value.slice(end);

            textarea.selectionStart =
            textarea.selectionEnd = start + 1;
            return;
        }

        // =========================
        // Ctrl+/
        // =========================
        if (e.ctrlKey && e.key === "/") {
            e.preventDefault();

            const lineStart =
                value.lastIndexOf("\n", start - 1) + 1;
            const lineEnd =
                value.indexOf("\n", start);

            const endPos = lineEnd === -1 ? value.length : lineEnd;
            const line = value.slice(lineStart, endPos);

            let newLine;
            if (line.trim().startsWith("//")) {
                newLine = line.replace("//", "");
            } else {
                newLine = "//" + line;
            }

            textarea.value =
                value.slice(0, lineStart) +
                newLine +
                value.slice(endPos);

            textarea.selectionStart =
            textarea.selectionEnd = start;
        }
    });
}




//========================================
//#region 初期化
//========================================

let openMaxKaiso = 0;

function Init(){

    // 開発用
    if(debug) DATABASE = mainData_TEST;

    // マックス階層
    openMaxKaiso = DATABASE.MASTER[0].MASTER_PGCATEGORY.find(a => a.hasOwnProperty("kaisoCount")).kaisoCount;

    // パッチ適用
    applyPatch();

    // メニューソース（２階層まで。別メニューの名前がまるごと入るのはNG。名前をキーにindexOf検索してフォーカスしているため）
    menuData = 
    {
        "1stMenu":[
            {
                "name": "ワーク", "nextMenu": [
                    {"name": "デイリー記録", "id": WORK_DAILY, "icon":svg_calendar,"bootSys": null},
                    {"name": "タスク管理",  "id": WORK_TASK, "icon":svg_task,"bootSys": bootSys_WORK_TASK},
                    // {"name": "フローチャート",  "id": WORK_FLOW, "icon":svg_brain,"bootSys": bootSys_WORK_FLOW},
                    {"name": "雑多メモ",   "id": WORK_MEMO, "icon":svg_memo,"bootSys": bootSys_WORK_MEMO},
                    {"name": "PGビューアー",  "id": WORK_PGVIEWER, "icon":svg_map,"bootSys": bootSys_WORK_PGVIEWER},
                    {"name": "ツール管理",  "id": WORK_TOOLMANAGER, "icon":svg_android,"bootSys": bootSys_WORK_TOOLMANAGER},
                    {"name": "外部リンク",  "id": WORK_LINK, "icon":svg_link,"bootSys": null},
                ]
            },
            {
                // 保留時、bootSys : nullでok
                "name": "リソース", "nextMenu": [
                    {"name": "プログラム階層","id": MASTER_PGCATEGORY, "icon":svg_category2,"bootSys": bootSys_MASTER_PGCATEGORY},
                    {"name": "プログラム情報","id": MASTER_PGINFO, "icon":svg_info,"bootSys": bootSys_MASTER_PGINFO},
                    {"name": "作業カテゴリ", "id": MASTER_WORKCATEGORY, "icon":svg_category,"bootSys": bootSys_MASTER_WORKCATEGORY},
                    {"name": "タグ管理",    "id": MASTER_TAGMANAGER, "icon":svg_tag,"bootSys": bootSys_MASTER_TAGMANAGER},
                    {"name": "設定",  "id": MASTER_SETTING, "icon":svg_setting,"bootSys": null},
                ]
            },
            {
                // 保留時、bootSys : nullでok
                "name": "AI", "nextMenu": [
                    {"name": "システム代行","id": AI_AGENCY, "icon":svg_agent_white,"bootSys": bootSys_AI_AGENCY},
                ]
            },
        ]
    };
    
    // メニュー構築
    buildMenu();
    
    // 各システム起動
    {
        bootSys_MASTER_TAGMANAGER(true); // タグ管理
        bootSys_MASTER_WORKCATEGORY(true); // 作業カテゴリ
        bootSys_MASTER_PGCATEGORY(true); // プログラム階層
        bootSys_MASTER_PGINFO(true); // プログラム情報
        bootSys_WORK_TASK(true); // タスク管理
        bootSys_WORK_FLOW(true); // フローチャート
        bootSys_WORK_MEMO(true); // 雑多メモ
        bootSys_WORK_TOOLMANAGER(true); // ツール管理
    }

    // プロジェクト名
    document.getElementById("PNameBox").value = DATABASE.META[0].PROJECTNAME;

    log("システムを起動しました")

    
}




// 個別画面制御

//#region リソース-プログラム階層*********************************************************************************************************************************

function bootSys_MASTER_PGCATEGORY(isFirst){

    // すでに起動済み
    if(!isFirst){
        // uodate
        // rebuild kaiso
        //rebuildTable
        return;
    }

    // dom
    const levelCntBox = getDOM("level-count");
    const registerForm = getDOM("kaiso-register-form");

    // change levelCount
    levelCntBox.addEventListener("change", function(){
        // cnt
        const levelCnt = levelCntBox.value;

        // max check
        if(levelCnt > 5){
            alert("最大５階層まで設定できます")
            levelCntBox.value = 5;
            levelCntBox.dispatchEvent(new MouseEvent("change"))
            return;
        }

        // clone for work
        var cloneRepo = DATABASE.MASTER[0].MASTER_PGCATEGORY;

        // update count（配列からkaisoCountというキーのオブジェクトを取得➤kaisoCountのvalueを更新）
        cloneRepo.find(a => a.hasOwnProperty("kaisoCount"))["kaisoCount"] = levelCnt;

        // form clear
        registerForm.innerHTML = "";
        getDOM("kaiso-register-formWrpper").hidden = false;
        getDOM("kaiso-table-formWrpper").hidden = false;
        if(getDOM("zeroLabel_kaiso")) getDOM("zeroLabel_kaiso").remove();

        // kaiso = 0 (end)
        if(levelCnt==0) {
            // hidden
            getDOM("kaiso-register-formWrpper").hidden = true;
            getDOM("kaiso-table-formWrpper").hidden = true;
            // zeroLabel
            const zeroLabel = createDOM("label");
            zeroLabel.style.color="red";
            zeroLabel.textContent="プログラムを階層管理しません";
            zeroLabel.id="zeroLabel_kaiso";
            this.parentElement.appendChild(zeroLabel)
            return;
        }

        // roop
        for(let index = 1; index <= levelCnt; index++){
            const keyName = `kaiso${index}`;
            
            // create repository
            if(!cloneRepo.some(a => a.hasOwnProperty(keyName))){
                cloneRepo.push({[keyName]:[]}); // 変数の場合[]で評価値をキー名に設定
            }

            // create (セレクト、登録セットをネスト)
            const container = createDOM("div")
            container.classList.add("level-row");

            // kaiso select **id = "kaisoSelect1ForInput2PGCATEGORY"**
            if(index > 1){
                let kaisoSelectList = createDOM_kaisoSelect(index-1);
                for(let i = 1; i <= (index-1); i++){
                    let select = kaisoSelectList[i];
                    select.id = `kaisoSelect${i}ForInput${index}PGCATEGORY`;
                    container.appendChild(select);
                }
            }


            // register set
            const nameInput = createDOM("input");
            const registerButton = createDOM("button");
            {
                // prop
                nameInput.type = "text";
                nameInput.placeholder = `階層${index}名称...`;
                nameInput.classList.add("medium-input");
                registerButton.classList.add("mini-btn");
                registerButton.textContent = "登録";
            }
            container.appendChild(nameInput);
            container.appendChild(registerButton);
            registerForm.appendChild(container);

            // register**
            registerButton.addEventListener("click",function(e){

                const nameValue = nameInput.value.trim();
                // input check
                if(!nameValue){
                    alert(`階層${index}名を入力してください`);
                    return;
                }

                // kaiso select check
                for(let i = 1; i <= (index-1); i++){
                    if(!getDOM(`kaisoSelect${i}ForInput${index}PGCATEGORY`).value){
                        alert(`所属階層${i}を選択してください`)
                        return;
                    }
                }

                // get unique ID in （同一階層ですべての親IDが同じ　つまり並列位置）
                var let = false;
                var uniqueID = getRandomString20();
                while(!let){
                    let = true;
                    if(cloneRepo.find(a => a.hasOwnProperty(`kaiso${index}`))[`kaiso${index}`].some(b => b.id == uniqueID) ){
                        let = false;
                        uniqueID = getRandomString20();
                    }
                    if(let) break;
                }

                // // check unique name in （同一階層ですべての親IDが同じ　つまり並列位置　※ここまで絞らないと同一名が使用できない）
                if(index==1){
                    if(cloneRepo.find(a => a.hasOwnProperty(`kaiso${index}`))[`kaiso${index}`].some(b => b.name == nameValue)){
                        alert(`[${nameValue}] は最上階層にすでに存在しています`)
                        nameInput.value = "";
                        return;
                    }
                }else{
                    if(cloneRepo.find(a => a.hasOwnProperty(`kaiso${index}`))[`kaiso${index}`].some(b => getCondition(b))){
                        alert(`[${nameValue}] は指定位置にすでに存在しています`)
                        nameInput.value = "";
                        return;
                    }
                    function getCondition(a){
                        var end = false;
                        for(let i = 1; i <= (index-1); i++){
                            let tmp = `kaiso${i}ID`;
                            if(a[tmp] != getDOM(`kaisoSelect${i}ForInput${index}PGCATEGORY`).value){
                                end = true;
                                break;
                            }
                        }
                        if(end) return false;
                        else if(a.name==nameValue) return true;
                        else return false;
                    }
                }

                // create data
                let dataObj = {"id":uniqueID, "name":nameValue};
                let tmpKeyName = `kaiso${index}`
                for(let i = 1; i <= (index-1); i++){
                    let tmp = `kaiso${i}ID`;
                    dataObj[tmp] = getDOM(`kaisoSelect${i}ForInput${index}PGCATEGORY`).value;
                }
                cloneRepo.find(a => a.hasOwnProperty(tmpKeyName))[tmpKeyName].push(dataObj)

                // update
                DATABASE.MASTER[0].MASTER_PGCATEGORY = cloneRepo;

                // rebuild


                // reset
                nameInput.value="";
                nameInput.focus();

                // update select（１登録後のみすぐ反映。２階層ですぐ使うため）
                if(index == 1){
                    for(let i = index+1; i <= levelCnt; i++){
                        let tmp = getDOM(`kaisoSelect1ForInput${i}PGCATEGORY`);
                        while(tmp.options.length > 1){
                            tmp.remove(1);
                        }
                        // option
                        for(let target of cloneRepo.find(a => a.hasOwnProperty(`kaiso1`))[`kaiso1`]){
                            const option = createDOM("option");
                            option.value = target.id;
                            option.textContent = target.name;
                            tmp.appendChild(option);
                        } 
                    }
                }
            })
            
            // enter to register
            nameInput.addEventListener("keydown", function(e){
                if(e.key=="Enter"){
                    registerButton.dispatchEvent(new MouseEvent("click"));
                }
            })
        }

        // update
        DATABASE.MASTER[0].MASTER_PGCATEGORY = cloneRepo;

    })

    init_PGCATEGORY();
    function init_PGCATEGORY(){
        levelCntBox.dispatchEvent(new MouseEvent("change"))
    }

}







//#region リソース-プログラム情報*********************************************************************************************************************************

// 登録用階層
let arrayKaiso_pgInfo_registerForm = [];

function bootSys_MASTER_PGINFO(isFirst){

    // すでに起動済み
    if(!isFirst){
        // uodate
        createKaiso();
        //rebuildTable 
        return;
    }
    

    // create pg kaiso
    function createKaiso(){
        const kaisoContainer = getDOM("pg-info-kaiso-container");// パブリックで取得
        kaisoContainer.innerHTML = "";
        var maxKaiso = DATABASE.MASTER[0].MASTER_PGCATEGORY.find(a => a.hasOwnProperty("kaisoCount")).kaisoCount;
        arrayKaiso_pgInfo_registerForm = createDOM_kaisoSelect(maxKaiso);
        for(let index = 1; index <= maxKaiso; index++){
            const div = createDOM("div");
            const label = createDOM("label");
            {
                div.classList.add("form-row")
                div.style.width="30%";
                label.textContent = `階層${index}`;
            }
            div.appendChild(label);
            div.appendChild(arrayKaiso_pgInfo_registerForm[index]);
            kaisoContainer.appendChild(div);
        }
    }
    createKaiso();

    const registerButton = getDOM("register-button-pginfo");// register
    const nameInput = getDOM("name-input-pginfo"); //pg name 
    const idInput = getDOM("id-input-pginfo"); // pg id
    const remarkInput = getDOM("remark-input-pginfo"); // remark

    // register
    registerButton.addEventListener("click",function(){
        
        // input check**
        // for(let kaisoSelect of arrayKaiso_pgInfo_registerForm){
        //     if(kaisoSelect != null && kaisoSelect.value==""){
        //         alert("すべての階層を選択してください");
        //         return;
        //     }
        // }
        
        if(!nameInput.value.trim()){
            alert("PG名称を入力してください")
            return;
        }
        if(!idInput.value.trim()){
            alert("PGIDを入力してください")
            return;
        }

        // kaisoCSV
        var kaisoCSV = "";
        for(let kaisoSelect of arrayKaiso_pgInfo_registerForm){
            if(kaisoSelect != null && kaisoSelect.value != ""){
                kaisoCSV += `${kaisoSelect.value},`;
            }
        }
        if(kaisoCSV != ""){
            // 末尾カンマ除外
            kaisoCSV = kaisoCSV.slice(0, -1)
        }

        // clone for work
        var cloneRepo = DATABASE.MASTER[0].MASTER_PGINFO;

        // dup check**
        // unique ID in tag master
        var let = false;
        var id = getRandomString20();
        while(!let){
            let = true;
            for(var target of cloneRepo){
                if(target.id == id){
                    let = false;
                    id = getRandomString20();
                }
            }
            if(let) break;
        }

        // unique name in master
        let = true;
        for(var target of cloneRepo){
            if(target.name == nameInput.value.trim() && target.kaisoCSV == kaisoCSV){
                let = false;
            }
        }
        if(!let) {
            alert("指定した階層に同一名のプログラムが存在します")
            return;
        }

        // unique pgid in all
        let = true;
        for(var target of cloneRepo){
            if(target.pgid == idInput.value.trim()){
                let = false;
            }
        }
        if(!let) {
            alert("このPGIDはすでに登録されています")
            return;
        }

        // insert
        var obj = 
        {
            "id": id,
            "pgid":idInput.value.trim(),
            "name": nameInput.value.trim(),
            "kaisoCSV":kaisoCSV,
            "remark": remarkInput.value.trim()
        };
        cloneRepo.push(obj)

        // update
        DATABASE.MASTER[0].MASTER_PGINFO = cloneRepo;

        // rebuild


        // log
        log(`プログラム [${idInput.value.trim()} : ${nameInput.value.trim()}] を登録しました`)

        // reset　※階層はリセットしない、PG名称にフォーカス
        nameInput.value = "";
        idInput.value = "";
        remarkInput.value = "";
        nameInput.focus();
        
        // writeDataLog()

    })

    // enterでフォーカス遷移
    nameInput.addEventListener("keydown",function(e){
        if(e.key=="Enter") idInput.focus();
    })
    idInput.addEventListener("keydown",function(e){
        if(e.key=="Enter") remarkInput.focus();
    })

    // enter to register
    remarkInput.addEventListener("keydown",function(e){
        if(e.key=="Enter") {
            registerButton.dispatchEvent(new MouseEvent("click"))
        }
    })



}


//#region AI-システム代行（起動）*********************************************************************************************************************************

// BOX
// const massage_box_agency = getDOM("massage-box-agency");
// ENTER
// const massage_enter_agency = getDOM("massage-enter-agency");
// BODY
const agent_chat_body = getDOM("agent-chat-body"); 

function bootSys_AI_AGENCY(isFirst)
{

    // -------------------------------------------------------------------------------------------
    // パターンデータ定義（ParamaterCodeは重複不可。innerHTML生成関数へ渡すユニークコード）
    // -------------------------------------------------------------------------------------------
    let MsgData = [

        //==================================================
        // 問い合わせ（情報取得・確認系）
        //==================================================
        {
            PRINTNAME: "問い合わせ",
            CHILDARR: [

                // -------------------------
                // タスク関連
                // -------------------------
                {
                    PRINTNAME: "タスク関連",
                    CHILDARR: [
                        { PRINTNAME: "指定日に完了したタスク", PARAMCD: 1, OPTION: "日付指定,date"},
                        { PRINTNAME: "未完了のタスク", PARAMCD: 2 },
                        { PRINTNAME: "作業メモを検索", PARAMCD: 3, OPTION: "検索ワード（カンマ区切り）,text" }
                    ]
                },

                // // -------------------------
                // // 作業ログ / デイリー
                // // -------------------------
                // {
                //     PRINTNAME: "作業記録",
                //     CHILDARR: [
                //         { PRINTNAME: "今日の作業一覧" },
                //         { PRINTNAME: "今週の作業サマリ" },
                //         { PRINTNAME: "作業時間ランキング" },
                //         { PRINTNAME: "未入力の日を探す" }
                //     ]
                // },

                // // -------------------------
                // // プログラム / PGビューア
                // // -------------------------
                // {
                //     PRINTNAME: "プログラム",
                //     CHILDARR: [
                //         { PRINTNAME: "最近触ったPG" },
                //         { PRINTNAME: "カテゴリ別PG一覧" },
                //         { PRINTNAME: "未分類PG" },
                //         { PRINTNAME: "タグ未設定PG" }
                //     ]
                // },

                // // -------------------------
                // // 設定・状態確認
                // // -------------------------
                // {
                //     PRINTNAME: "システム状態",
                //     CHILDARR: [
                //         { PRINTNAME: "今日の操作履歴" },
                //         { PRINTNAME: "直近エラー一覧" },
                //         { PRINTNAME: "未保存データの有無" }
                //     ]
                // }
            ]
        },

        //==================================================
        // 代行（操作・実行系）
        //==================================================
        {
            PRINTNAME: "代行依頼",
            CHILDARR: [

                // // -------------------------
                // // タスク操作
                // // -------------------------
                // {
                //     PRINTNAME: "タスク",
                //     CHILDARR: [
                //         { PRINTNAME: "タスクを新規作成" },
                //         { PRINTNAME: "今日のタスクを完了にする" },
                //         { PRINTNAME: "期限を明日に変更" },
                //         { PRINTNAME: "優先度を上げる" }
                //     ]
                // },

                // -------------------------
                // 便利
                // -------------------------
                {
                    PRINTNAME: "作成",
                    CHILDARR: [
                        { PRINTNAME: "TODOリスト", PARAMCD: 101 },
                    ]
                },

                // // -------------------------
                // // 作業記録操作
                // // -------------------------
                // {
                //     PRINTNAME: "作業記録",
                //     CHILDARR: [
                //         { PRINTNAME: "今日の作業を自動記録" },
                //         { PRINTNAME: "昨日の作業をコピー" },
                //         { PRINTNAME: "空白日をまとめて補完" }
                //     ]
                // },

                // // -------------------------
                // // PGビューア操作
                // // -------------------------
                // {
                //     PRINTNAME: "PGビューア",
                //     CHILDARR: [
                //         { PRINTNAME: "ツリーを自動展開" },
                //         { PRINTNAME: "該当PGをハイライト" },
                //         { PRINTNAME: "関連PGを開く" }
                //     ]
                // },

                // // -------------------------
                // // 一括処理・整理
                // // -------------------------
                // {
                //     PRINTNAME: "整理",
                //     CHILDARR: [
                //         { PRINTNAME: "未分類データを整理" },
                //         { PRINTNAME: "古いデータをアーカイブ" },
                //         { PRINTNAME: "タグを自動付与" }
                //     ]
                // }
            ]
        }
    ];

    // 履歴読込
    function loadPastChat(){
        // 
    }
    loadPastChat();

    // -------------
    // 開始
    // -------------
    const containerID = "parent-container-agency";
    const optionID = "option-input-agency";
    
    function startChat(){
        
        // RESET
        if(getDOM(containerID)) getDOM(containerID).remove();
        
        // CONTAINER
        const parentContainer = createDOM("div");
        parentContainer.id = containerID;
        parentContainer.classList.add("parent-container-agency");
        getDOM(AI_AGENCY + "_PANEL").appendChild(parentContainer);

        // PATH
        const pathLabel = createDOM("label");
        pathLabel.classList.add("pg-work-path")

        // 変数
        let path = "";

        for(let parentObj of MsgData){
            
            // --------
            // FIRST
            // --------
            const parentButton = createDOM("button");
            parentButton.textContent = parentObj.PRINTNAME;
            parentButton.classList.add("parent-button-agency");
            parentContainer.appendChild(parentButton);

            // CLICK
            parentButton.addEventListener("click", function(e){

                // CLEAR
                parentContainer.innerHTML = "";
                path += parentObj.PRINTNAME;
                parentContainer.appendChild(pathLabel);

                for(let secondObj of parentObj.CHILDARR){
                    
                    // PATH
                    pathLabel.textContent = path;
                    
                    // --------
                    // SECOND
                    // --------
                    const secondButton = createDOM("button");
                    secondButton.textContent = secondObj.PRINTNAME;
                    secondButton.classList.add("parent-button-agency");
                    parentContainer.appendChild(secondButton);

                    // CLICK
                    secondButton.addEventListener("click", function(e){

                        // CLEAR
                        parentContainer.innerHTML = "";
                        path += "> " + secondObj.PRINTNAME;
                        parentContainer.appendChild(pathLabel);

                        for(let thirdObj of secondObj.CHILDARR){
                            
                            // PATH
                            pathLabel.textContent = path;
                            
                            // --------
                            // END
                            // --------
                            const thirdButton = createDOM("button");
                            thirdButton.textContent = thirdObj.PRINTNAME;
                            thirdButton.classList.add("parent-button-agency");
                            parentContainer.appendChild(thirdButton);

                            // 「送信」 || 「オプションへ」
                            let sendSpan = createDOM("span");
                            sendSpan.classList.add("notice-gray");
                            sendSpan.innerHTML = thirdObj.hasOwnProperty("OPTION") ? "オプションへ" : "送信";
                            thirdButton.appendChild(sendSpan);

                            // SEND MASSAGE
                            thirdButton.addEventListener("click", function(e){
                                
                                // オプションなし
                                if(!thirdObj.hasOwnProperty("OPTION")) {
                                    // SET
                                    massageSender(thirdObj.PARAMCD)
                                    // CLEAR
                                    parentContainer.remove();
                                }

                                // オプションあり
                                else{

                                    let opHint = thirdObj.OPTION.split(",")[0];
                                    let opType = thirdObj.OPTION.split(",")[1];

                                    // CLEAR
                                    parentContainer.innerHTML = "";
                                    pathLabel.textContent = opHint;
                                    parentContainer.appendChild(pathLabel);

                                    // OPTION SET
                                    const optionInput = createDOM("input");
                                    const optionEnter = createDOM("button");
                                    parentContainer.appendChild(optionInput);
                                    parentContainer.appendChild(optionEnter);

                                    // PROP
                                    optionInput.type = opType;
                                    optionInput.id = "option-input-agency";
                                    optionInput.spellcheck = false; 
                                    optionInput.autoComplete = false; 
                                    optionEnter.textContent = "送信";
                                    parentContainer.classList.add("agency-option-wrap")
                                    optionInput.classList.add("agency-option-input")
                                    optionEnter.classList.add("agency-option-enter")
                                    optionInput.focus();

                                    // INIT
                                    if(opType == "date"){
                                        
                                        // 初期値：今日
                                        optionInput.value = getToday();
                                    }

                                    // ENTER
                                    optionEnter.addEventListener("click", function(){
                                        // 必須
                                        if(optionInput.value == ""){
                                            alert("オプションを入力してください")
                                            return;
                                        }
                                        // SET
                                        massageSender(thirdObj.PARAMCD);
                                        // CLEAR
                                        parentContainer.remove();
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    }

    // 開始
    startChat();

    // ----------------------
    // 送信メッセージ挿入
    // ----------------------
    function massageSender(pCd){
        
        let msg = "";
        let optionVal = "";

        switch(pCd){

            // OP：指定日に完了したタスク
            case 1 :
                optionVal = getDOM(optionID).value;
                msg = `${optionVal==getToday() ? "今日" : optionVal + " に"}完了したタスクを教えて`;
            break;

            // 未完了のタスク
            case 2 :
                msg = `未完了のタスクを教えて`;
            break;

            // OP：作業メモ検索
            case 3 :
                optionVal = getDOM(optionID).value;
                msg = `[${optionVal}] を含む作業メモを探して`;
            break;

            // todoリスト作成
            case 101 :
                msg = `TODOリストを作って`;
            break;
        }

        // SEND
        insertBlock(msg, pCd, false);

    }

    // ------------------------------
    // メッセージブロック挿入
    // ------------------------------
    function insertBlock(msg, pCd, isAnswer){

        // System
        if(isAnswer){
            agent_chat_body.insertAdjacentHTML("beforeend", 
                `<label style="color: gray; font-size: 11px;">System</label>
                <div class="chat-row agent">
                    <div class="chat-bubble">
                        ${msg}
                    </div>
                </div>
                `)

        // User
        }else{
            agent_chat_body.insertAdjacentHTML("beforeend", 
                `<span class="chat-date">${getTime()}</span><div class="chat-row user">
                    <div class="chat-bubble">
                        ${msg}
                    </div>
                </div>
                `)

            // ANSER
            answerBuilder(pCd);
        }

        // SCROLL
        agent_chat_body.scrollTop = agent_chat_body.scrollHeight;

        // CLEAR
        startChat();
    }

    // ----------------------
    // 回答メッセージ作成
    // ----------------------
    function answerBuilder(pCd){

        let answerHtml = "";

        switch(pCd){

            // =====================================================================
            // OP：指定日に完了したタスク
            // =====================================================================
            case 1 :
            {
                // オプションvalue
                let optionVal = getDOM(optionID).value;

                // 進捗率100且つcompDateが指定日
                let refArr = DATABASE.WORK[0].WORK_TASK
                            .filter(a => a["progress"] == 100 && a["compDate"] == optionVal);

                // 該当なし
                if(refArr.length == 0){
                    answerHtml = `${optionVal==getToday() ? "本日" : optionVal + " に"}完了したタスクはありません`;
                    break;
                }else{
                    answerHtml = `${optionVal==getToday() ? "本日" : optionVal + " に"}完了したタスク${refArr.length}件を表示します`;
                }

                // 組み立て
                for(let taskObj of refArr){
                    // パス・PG名・PGID・内容
                    let pgInfo = taskObj["pgInfo"];
                    let content = taskObj["content"];
                    answerHtml += `
                    <div class="taskinfo-container-agency">
                        <div class="pginfo-agency">${pgInfo}</div>
                        <div class="content-agency">${content}</div>
                        <div onclick="bootSub_taskMemos('${taskObj["id"]}', true);" class="like-link">メモを見る</div>
                    </div>
                    `;
                }
            }
            break;

            // =====================================================================
            // 未完了のタスク
            // =====================================================================
            case 2 :
            {
                // 未完了のタスクを取得
                let refArr = DATABASE.WORK[0].WORK_TASK
                            .filter(a => a["progress"] != 100);

                // 該当なし
                if(refArr.length == 0){
                    answerHtml = `未完了のタスクはありません`;
                    break;
                }else{
                    answerHtml = `未完了のタスク${refArr.length}件を表示します`;
                }

                // 組み立て
                for(let taskObj of refArr){
                    // パス・PG名・PGID・内容
                    let pgInfo = taskObj["pgInfo"];
                    let content = taskObj["content"];
                    answerHtml += `
                    <div class="taskinfo-container-agency">
                        <div class="pginfo-agency">${pgInfo}</div>
                        <div class="content-agency">${content}</div>
                        <div onclick="bootSub_taskMemos('${taskObj["id"]}', true);" class="like-link">メモを見る</div>
                    </div>
                    `;
                }
            }
            break;

            // =====================================================================
            // OP：作業メモ検索
            // =====================================================================
            case 3 :
            {
                // オプションvalue
                let optionVal = getDOM(optionID).value;

                // 絞り込み
                let refArr_task = [];
                let refArr_memo = [];
                for(let taskObj of DATABASE.WORK[0].WORK_TASK){

                    // メモ配列
                    for(let memoObj of taskObj["memos"]){

                        // マッチ（タスク・メモ配列を同列で扱うことで同期）
                        if(multiMatch(memoObj["title"], optionVal) || multiMatch(memoObj["memoText"], optionVal)) {
                            refArr_task.push(taskObj);
                            refArr_memo.push(memoObj);
                        }
                    }
                }

                // 該当なし
                let count = refArr_memo.length;
                if(count == 0){
                    answerHtml = `[${optionVal}] を含む作業メモは見つかりませんでした`;
                    break;
                }else{
                    answerHtml = `[${optionVal}] を含む${count}件の作業メモを表示します`;
                }

                // 組み立て
                for(let index = 0; index < count; index++){
                    // パス・PG名・PGID・内容
                    let pgInfo = refArr_task[index]["pgInfo"];
                    let content = refArr_task[index]["content"];
                    let title = refArr_memo[index]["title"];
                    let memoText = refArr_memo[index]["memoText"];
                    answerHtml += `
                    <div class="taskinfo-container-agency">
                        <div class="pginfo-agency">${pgInfo}</div>
                        <div class="pginfo-agency">${content}</div>
                        <div class="content-agency" style="font-weight: bold;">- ${title}</div>
                        <textarea class="textarea-agency" readonly>${memoText}</textarea>
                        <div onclick="bootSub_taskMemos('${refArr_task[index]["id"]}', true);" class="like-link">メモを見る</div>
                    </div>
                    `;
                }
            }
            break;

            // =====================================================================
            // todoリスト作成
            // =====================================================================
            case 101 :
            {
                answerHtml = `TODOリストを作成します`;
                answerHtml += `
                <div class="todo-agency-root">
                    <div class="todo-agency-header">
                        TODOリスト
                    </div>
                    <div class="todo-agency-add">
                        <input
                            type="text"
                            id="todo-input-agency"
                            placeholder="やることを入力"
                        >
                        <button onclick="">追加</button>
                    </div>
                    <ul class="todo-agency-list" id="todo-list-agency">
                        <!-- todo item -->
                    </ul>
                </div>
                `
            }
            break;
        }

        // ANSWER
        insertBlock(answerHtml, pCd, true);
    }

}





//#region リソース-タグ管理（起動）*********************************************************************************************************************************
function bootSys_MASTER_TAGMANAGER(isFirst)
{

    // すでに起動済み
    if(!isFirst){
        // uodate
        //rebuildTable
        return;
    }

    const namebox = document.getElementById("tagNameBox");
    const registerButton = document.getElementById("insTagButton");
    
    // click register button
    registerButton.addEventListener("click", function(e){
        
        // check
        if(!namebox.value.trim()){
            alert("タグ名を入力してください。")
            return;
        } 

        // unique ID in tag master
        var let = false;
        var id = getRandomString20();
        while(!let){
            let = true;
            for(var target of DATABASE.MASTER[0].MASTER_TAGMANAGER){
                if(target.id == id){
                    let = false;
                    id = getRandomString20();
                }
            }
            if(let) break;
        }

        // unique name in master
        if(!chkUniqueName()) return;
        function chkUniqueName(paramTarget = target, paramValue = namebox.value.trim()){
            let = true;
            for(var paramTarget of DATABASE.MASTER[0].MASTER_TAGMANAGER){
                if(paramTarget.name == paramValue){
                    let = false;
                    break;
                }
            }
            if(!let) {
                // reset
                alert(`タグ [${paramValue}] はすでに存在しています`)
                namebox.value="";
                namebox.focus();
                return false;
            }
            return true;
        }

        // add data
        DATABASE.MASTER[0].MASTER_TAGMANAGER.push({"id":id, "name": namebox.value.trim()});

        // rebuild table by new Data
        rebuild();
        function rebuild()
        {
            // reset
            document.getElementById("tag-table-tbody").innerHTML = "";

            var num = 1;
            for(const target of DATABASE.MASTER[0].MASTER_TAGMANAGER){
                const tr = document.createElement("tr");
                for(let index = 1; index <= 3; index++){
                    // No...Name...DelButton
                    switch(index){
                        // No
                        case 1:{
                            const td = document.createElement("td")
                            td.textContent = num;
                            tr.appendChild(td);
                            break;
                        }
                        // Name
                        case 2:{
                            const td = document.createElement("td")
                            const input = document.createElement("input")
                            input.type = "text";
                            input.value = `#${target.name}`;
                            td.appendChild(input);
                            tr.appendChild(td);
                            const prevValue = target.name;
                            // event
                            {
                                // restration "#"
                                input.addEventListener("input",function(){
                                    if(this.value=="") this.value="#";
                                })
                                // update
                                input.addEventListener("change",function(){
                                    // check
                                    const value = input.value.replace("#","");
                                    if(!value){
                                        alert("タグ名を入力してください。")
                                        this.value = "#"+prevValue;
                                        return;
                                    } 

                                    // unique name
                                    if(!chkUniqueName(target, value)) {
                                        this.value = "#"+prevValue;
                                        return;
                                    }

                                    // update
                                    DATABASE.MASTER[0].MASTER_TAGMANAGER.find(a => a.id===target.id).name = value;

                                    //log
                                    log(`タグ名を更新しました [${prevValue}] → [${value}]`)

                                    rebuild();
                                })
                                // enter to update
                                input.addEventListener("keydown",function(e){
                                    // change発動　※dispatchだと２回走っちゃう
                                    if(e.key=="Enter") document.body.focus();
                                })
                            }
                            break;
                        }
                        // DelButton
                        case 3:{
                            const td = document.createElement("td")
                            const delButton = document.createElement("button")
                            delButton.classList.add("medium-button-red");
                            delButton.style.width = "100%";
                            delButton.textContent = "削除";
                            td.appendChild(delButton);
                            tr.appendChild(td);
                            delButton.addEventListener("click", function(){
                                if(confirm(`タグ [${target.name}] を削除しますか？`)){
                                    // delete（除外取得）
                                    const arr = DATABASE.MASTER[0].MASTER_TAGMANAGER;
                                    DATABASE.MASTER[0].MASTER_TAGMANAGER = arr.filter(data => data.id !== target.id);

                                    // log
                                    log(`タグ [${target.name}] を削除しました`)

                                    //rebuild
                                    rebuild();
                                }
                            })
                            break;
                        }
                    }
                }
                document.getElementById("tag-table-tbody").appendChild(tr);
                num++;
            }
        }
        // log
        log(`タグ [${namebox.value.trim()}] を登録しました`);

        // scroll
        document.getElementById("tag-table-wrapper").scrollTop = document.getElementById("tag-table-wrapper").scrollHeight;

        // reset
        namebox.value="";
        namebox.focus();
    })

    // enter to register
    namebox.addEventListener("keydown", function(e){
        if(e.key=="Enter"){
            registerButton.dispatchEvent(new MouseEvent("click"));
        }
    })

}


//#region リソース-作業カテゴリ（起動）*********************************************************************************************************************************
function bootSys_MASTER_WORKCATEGORY(isFirst)
{

    // すでに起動済み
    if(!isFirst){
        // uodate
        //rebuildTable
        return;
    }

    const namebox = document.getElementById("workCategpryNameBox");
    const registerButton = document.getElementById("insWorkCategoryButton");
    
    // click register button
    registerButton.addEventListener("click", function(e){
        
        // check
        if(!namebox.value.trim()){
            alert("カテゴリ名を入力してください。")
            return;
        } 

        // unique ID in category master
        var let = false;
        var id = getRandomString20();
        while(!let){
            let = true;
            for(var target of DATABASE.MASTER[0].MASTER_WORKCATEGORY){
                if(target.id == id){
                    let = false;
                    id = getRandomString20();
                }
            }
            if(let) break;
        }

        // unique name in master
        if(!chkUniqueName()) return;
        function chkUniqueName(paramTarget = target, paramValue = namebox.value.trim()){
            let = true;
            for(var paramTarget of DATABASE.MASTER[0].MASTER_WORKCATEGORY){
                if(paramTarget.name == paramValue){
                    let = false;
                    break;
                }
            }
            if(!let) {
                // reset
                alert(`カテゴリ [${paramValue}] はすでに存在しています`)
                namebox.value="";
                namebox.focus();
                return false;
            }
            return true;
        }

        // add data
        DATABASE.MASTER[0].MASTER_WORKCATEGORY.push({"id":id, "name": namebox.value.trim()});

        // rebuild table by new Data
        rebuild();
        function rebuild()
        {
            // reset
            document.getElementById("workCategory-table-tbody").innerHTML = "";

            var num = 1;
            for(const target of DATABASE.MASTER[0].MASTER_WORKCATEGORY){
                const tr = document.createElement("tr");
                for(let index = 1; index <= 3; index++){
                    // No...Name...DelButton
                    switch(index){
                        // No
                        case 1:{
                            const td = document.createElement("td")
                            td.textContent = num;
                            tr.appendChild(td);
                            break;
                        }
                        // Name
                        case 2:{
                            const td = document.createElement("td")
                            const input = document.createElement("input")
                            input.type = "text";
                            input.value = target.name;
                            td.appendChild(input);
                            tr.appendChild(td);
                            const prevValue = target.name;
                            // event
                            {
                                // update
                                input.addEventListener("change",function(){
                                    // check
                                    const value = input.value;
                                    if(!value){
                                        alert("カテゴリ名を入力してください。")
                                        this.value = prevValue;
                                        return;
                                    } 

                                    // unique name
                                    if(!chkUniqueName(target, value)) {
                                        this.value = prevValue;
                                        return;
                                    }

                                    // update
                                    DATABASE.MASTER[0].MASTER_WORKCATEGORY.find(a => a.id===target.id).name = value;

                                    //log
                                    log(`カテゴリ名を更新しました [${prevValue}] → [${value}]`)

                                    rebuild();
                                })
                                // enter to update
                                input.addEventListener("keydown",function(e){
                                    // change発動　※dispatchだと２回走っちゃう
                                    if(e.key=="Enter") document.body.focus();
                                })
                            }
                            break;
                        }
                        // DelButton
                        case 3:{
                            const td = document.createElement("td")
                            const delButton = document.createElement("button")
                            delButton.classList.add("medium-button-red");
                            delButton.style.width = "100%";
                            delButton.textContent = "削除";
                            td.appendChild(delButton);
                            tr.appendChild(td);
                            delButton.addEventListener("click", function(){
                                if(confirm(`カテゴリ [${target.name}] を削除しますか？`)){
                                    // delete（除外取得）
                                    const arr = DATABASE.MASTER[0].MASTER_WORKCATEGORY;
                                    DATABASE.MASTER[0].MASTER_WORKCATEGORY = arr.filter(data => data.id !== target.id);

                                    // log
                                    log(`カテゴリ [${target.name}] を削除しました`)

                                    //rebuild
                                    rebuild();
                                }
                            })
                            break;
                        }
                    }
                }
                document.getElementById("workCategory-table-tbody").appendChild(tr);
                num++;
            }
        }
        // log
        log(`カテゴリ [${namebox.value.trim()}] を登録しました`);

        // scroll
        document.getElementById("task-category-table-wrapper").scrollTop = document.getElementById("task-category-table-wrapper").scrollHeight;

        // reset
        namebox.value="";
        namebox.focus();
    })

    // enter to register
    namebox.addEventListener("keydown", function(e){
        if(e.key=="Enter"){
            registerButton.dispatchEvent(new MouseEvent("click"));
        }
    })

}



//#region ワーク-PGビューアー（起動）*********************************************************************************************************************************

// tree
const pg_viewer_tree = getDOM("pg-viewer-tree")
const pg_viewer_work = getDOM("pg-viewer-work")
// 結果　："KAISO,KaisoIndex,KaisoObjId"
// 結果　："PG,PGObjID"   
let activeID_Viewer = "";
// オートクリックによるリビルト変数の更新を回避
let rebuildValiable_Viewer = true;

function bootSys_WORK_PGVIEWER(isFirst){

    // create viewer
    function create(){

        // WOKRING CLONE
        var cloneRepo_kaiso = DATABASE.MASTER[0].MASTER_PGCATEGORY;
        var cloneRepo_pginfo = DATABASE.MASTER[0].MASTER_PGINFO;

        // CLEAR
        pg_viewer_tree.innerHTML = `<div><input
                        type="text"
                        class="explorer-search-input"
                        placeholder="検索..."
                        id="kaiso-pg-search-viewer-header"
                        autocomplete="off";
                        onfocus="this.select()";
                        spellcheck="false">
                        <input type="hidden" id="kaiso-pg-search-hidden-viewer-header"></div>`;
        pg_viewer_work.innerHTML = "";

        // ATTACH SERACH EVENT
        let searchBoxId = "kaiso-pg-search-viewer-header";
        let searchBox = getDOM(searchBoxId);
        let searchHidden = getDOM("kaiso-pg-search-hidden-viewer-header");
        attachSearchHandler(searchBox, searchHidden, () => onSearchSelect(searchHidden, searchBoxId))
        searchBox.focus();

        // 検索ボックスフォーカス
        const panel = getDOM(WORK_PGVIEWER + "_PANEL");

        // フォーカス可能
        panel.tabIndex = 0;

        panel.addEventListener("keydown", function(e){
            // FOCUS SEARCH
            if(e.ctrlKey && (e.key === "P" || e.key === "p")){
                e.preventDefault();
                searchBox.focus();
            }
            // ALL OPEN
            if(e.ctrlKey && (e.key === "O" || e.key === "o")){
                e.preventDefault();
                allOpen();

            }
        })

        // ALL OPEN
        function allOpen(){
            // 記憶変数リセット
            activeID_Viewer = "";
            bootSys_WORK_PGVIEWER(false)
            for(let kaisoIdx = 1; kaisoIdx <= openMaxKaiso; kaisoIdx++){
                // findで指定したキーのオブジェクトを抽出できる（配列はindexでしか参照できないためfindで取得）
                let kaisoRepo = DATABASE.MASTER[0].MASTER_PGCATEGORY.find(obj => obj[`kaiso${kaisoIdx}`])[`kaiso${kaisoIdx}`];
                for(let kaisoObjTmp of kaisoRepo){
                    let el = getDOM(kaisoObjTmp["id"] + "_button_pgviewer");
                    if(el) el.dispatchEvent(new MouseEvent("dblclick"));
                }
            }
        }

        // BOOL
        var maxKaiso = cloneRepo_kaiso.find(a => a.hasOwnProperty("kaisoCount"))["kaisoCount"];

        // ===========================
        // 1:CREATE KAISO FOLDER
        // ===========================
        for(let index = 1; index <= maxKaiso; index++){
            
            let keyName = `kaiso${index}`;
            for(let target of cloneRepo_kaiso.find(a => a.hasOwnProperty(keyName))[keyName]){

                const container = createDOM("div");
                const button = createDOM("button");
                const icon = createDOM("span");
                const counter = createDOM("input");
                container.style.display = (index == 1 ? "block" : "none");
                // props
                {
                    container.id = target["id"] + "_pgviewer";
                    counter.id = target["id"] + "_hiddenCounter_pgviewer";
                    counter.type = "hidden";
                    counter.value = 0;
                    container.style.marginLeft = "15px";
                    container.style.backgroundColor = "#f3f6fa";
                    container.classList.add("pgviewer-kaisofolder-container");
                    button.textContent = target.name;
                    button.id = target["id"] + "_button_pgviewer";
                    button.style.display = "flex";
                    button.style.userSelect = "none";
                    button.classList.add("pgviewer-kaisofolder");
                    button.classList.add("bool-viewer-kaiso");
                    // icon.innerHTML = svg_task_gray;
                    icon.style.marginRight = "10px";
                    icon.classList.add("iconButton")
                    // if(index==1) button.style.fontWeight = "bold";
                }

                // append
                container.appendChild(button);
                container.appendChild(counter);
                button.prepend(icon);

                // event listener
                {
                    button.addEventListener("dblclick", function(){

                        // 親通知表示切替
                        let notice = getDOM(target["id"] + "_notice_pgviewer"); // null判定必須
                        let noticeHidden = false;

                        // toggle visible
                        for(let tmp of this.parentElement.children){
                            if(tmp != this && tmp != notice){
                                let state = tmp.style.display == "block" ? "none" : "block"
                                tmp.style.display=state;
                                if(state == "block") noticeHidden = true;
                            }
                        }

                        // 親通知
                        if(notice) notice.style.display = noticeHidden ? "none" : "inline-flex";
                    })
                    button.addEventListener("click", function(e){

                        // edit
                        editViewer("KAISO", target, (index == maxKaiso), index);

                        // style
                        for(let k of document.getElementsByClassName("bool-viewer-kaiso")){
                            k.classList.remove("selected-kaiso-viewer")
                        }
                        this.classList.add("selected-kaiso-viewer")

                        // ACTIVE
                        activeID_Viewer = `KAISO,${index},${target["id"]}`;
                    })
                }
                // 従属カウンタ
                if(index != 1){
                    let parentHidden = getDOM(target[`kaiso${index-1}ID`] + "_hiddenCounter_pgviewer");
                    parentHidden.value = parseInt(parentHidden.value) + 1;
                }

                // append to tree or parentKaiso (id_pgviewer)
                const parentDOM = (index == 1 ? pg_viewer_tree : getDOM(target[`kaiso${index-1}ID`] + "_pgviewer"));
                parentDOM.appendChild(container);
            }
        }
        // ===========================
        // 2:CREATE PG ELEMENT
        // ===========================
        for(let target of cloneRepo_pginfo){

            const container = createDOM("div");
            const button = createDOM("button");
            const remarkLabel = createDOM("label");
            const remarkInput = createDOM("input");
            const icon = createDOM("span");
            // container.appendChild(remarkLabel);
            // container.appendChild(remarkInput);
            let parentIDList = null;
            if(target["kaisoCSV"] != ""){
                parentIDList = target["kaisoCSV"].split(",");
            }

            // props
            {
                container.style.marginLeft = (parentIDList ? "25px" : "15px");
                container.style.display = "flex";
                container.style.display = "none";
                button.textContent = target.name;
                button.style.display = "flex";
                button.style.userSelect = "none";
                button.classList.add("pgviewer-pgelement");
                button.classList.add("bool-viewer-kaiso");
                button.id = target["id"] + "_button_pgviewer";
                remarkLabel.textContent = "備考：";
                remarkInput.placeholder = "メモを入力…";
                remarkInput.value = target["remark"];
                remarkInput.style.marginLeft = "10px";
                remarkInput.style.border = "none";
                remarkInput.style.color = "gray";
                remarkInput.style.borderBottom = "solid gray 1px";
                // icon.innerHTML = svg_edit_gray;
                icon.style.marginRight = "10px";
                icon.classList.add("iconButton")
            }

            // TASK COUNT（残タスク通知）
            let taskCount = 0;
            for(let taskObj of DATABASE.WORK[0].WORK_TASK){
                // 進捗率100未満のみ対象
                if(parseInt(taskObj["progress"]) == 100) continue;
                if(taskObj["pgObjId"] == target["id"]) taskCount++;
            }
            let notice = createDOM("span");
            notice.classList.add("notice");
            notice.innerHTML = taskCount;
            if(taskCount) button.appendChild(notice);

            button.prepend(icon);
            container.appendChild(button);

            // event listener
            {
                // copy pgid
                button.addEventListener("dblclick", function copyPGID(){
                    try{
                        navigator.clipboard.writeText(target.pgid).then(() => {
                            log(`クリップボードにコピーしました [${target["pgid"]}]`);
                        });
                    }catch(e){}
                })
                button.addEventListener("click", function(e){
                    // edit
                    editViewer("PG", target);

                    // style
                    for(let k of document.getElementsByClassName("bool-viewer-kaiso")){
                        k.classList.remove("selected-kaiso-viewer")
                    }
                    this.classList.add("selected-kaiso-viewer")

                    // ACTIVE
                    activeID_Viewer = `PG,${target["id"]}`;
                })
            }
            // hidden従属カウンタをインクリメント
            if(parentIDList){
                let parentHidden = getDOM(parentIDList[parentIDList.length-1] + "_hiddenCounter_pgviewer");
                parentHidden.value = parseInt(parentHidden.value) + 1;
            }
            // append
            try{
                (!parentIDList ? pg_viewer_tree : getDOM(parentIDList[parentIDList.length-1] + "_pgviewer")).appendChild(container);
            }catch(e){
                log(`[${target["pgid"]}:${target["name"]}] は所属階層が削除済みのため、ビューアーに生成されませんでした`);
            }
        }

        // ===========================
        // other:従属カウンタ反映
        // ===========================
        for(let index = 1; index <= maxKaiso; index++){
            let keyName = `kaiso${index}`;
            for(let target of cloneRepo_kaiso.find(a => a.hasOwnProperty(keyName))[keyName]){

                let container =  getDOM(target["id"] + "_pgviewer");
                for(let el of container.children){
                    if(el.tagName == "BUTTON"){
                        let span = createDOM("span");
                        let tmpCnt = getDOM(target["id"] + "_hiddenCounter_pgviewer").value;
                        span.innerHTML = `　${tmpCnt}件　`;
                        if(index == maxKaiso) span.innerHTML += "➤";
                        {
                            span.style.backgroundColor = "#d6e0ea";  // 淡いブルーグレー
                            span.style.color = "#2f3b48";            // 本文と同系
                            span.style.borderRadius = "10px";
                            span.style.padding = "2px 8px";
                            span.style.fontSize = "12px";
                            span.style.marginLeft = "8px";
                            // span.style.textDecoration = "underline";
                            // span.style.border = "1px solid #c7c7c7ff";
                        }
                        el.appendChild(span);
                        
                        // ============================~~
                        // TASK COUNT（残タスク通知）
                        // ============================~~
                        let taskCount = 0;
                        for(let taskObj of DATABASE.WORK[0].WORK_TASK){
                            // 進捗率100未満のみ対象
                            if(parseInt(taskObj["progress"]) == 100) continue;
                            let tmpPgObj = DATABASE.MASTER[0].MASTER_PGINFO
                                                .find(a => a["id"] == taskObj["pgObjId"]);
                            // 階層IDをパスに含む、未完了タスクのPGID
                            if(tmpPgObj && tmpPgObj["kaisoCSV"].includes(target["id"])) taskCount++;
                        }
                        let notice = createDOM("span");
                        notice.id = target["id"] + "_notice_pgviewer";
                        notice.classList.add("notice");
                        notice.innerHTML = taskCount;
                        if(taskCount) el.appendChild(notice);
                        
                        break;
                    }
                }
            }
        }
        // REBUILD
        if(!rebuildValiable_Viewer) activeID_Viewer = ""; 
        if(activeID_Viewer != ""){
            searchHidden.value = activeID_Viewer;
            activeID_Viewer = "";
            onSearchSelect(searchHidden, "", false);
        }
    }
    create();
}
// =============================================================================
// 関数名  ：editViewer
// 呼び出し：ビューアー階層/PGクリック
// 機能１  ：階層・PG情報の登録・編集機能を提供
// 機能２  ：PG付随メモのメイン編集画面を提供
// =============================================================================
function editViewer(kbn, targetObj, isMaxKaiso = false, kaisoIndex = 0){
    
    // MODE
    let MODE = {
        
        // 最上層・通常階層・PG
        // "FIRST_KAISO"   : kaisoIndex == 0,
        "MAX_KAISO"     : kbn == "KAISO" && isMaxKaiso,
        "NORMAL_KAISO"  : kbn == "KAISO" && !isMaxKaiso,
        "PG"            : kbn == "PG",
    };

    // clear
    pg_viewer_work.innerHTML = "";

    // innerHTML
    let tempHeader = "";
    let tempBody = "";
    let tempFooter = "";

    // -----------------
    // region 階層
    // -----------------
    if(MODE.MAX_KAISO || MODE.NORMAL_KAISO){

        // header
        tempHeader = `<div class="pg-work-header" id="pg-viewer-work-header"></div>`;

        // body
        tempBody = 
            `<div class="like-card-white" id="pg-viewer-work-body">
                <div class="tag-table-wrapper-viewer" >
                    <table class="tag-table">
                        <tbody id="pg-viewr-editor-body">
                        </tbody>
                    </table>
                </div>
            </div>`;

        // footer
        tempFooter = 
            `<div class="pg-work-footer" id="pg-viewer-work-footer">
                <div class="pg-work-footer-title">クイック登録</div>
                <div class="pg-work-form">
                    <input type="text" class="pg-input" id="nameBox_viewer" placeholder="名称">`
                    
                    // PGID
                    if(MODE.MAX_KAISO) tempFooter += `<input type="text" class="pg-input" id="idBox_viewer" placeholder="PGID">`
                    
                    tempFooter += `<button class="pg-work-add" id="quick_register_viewer">登録</button>
                </div>
            </div>`;

            pg_viewer_work.innerHTML = (tempHeader + tempBody + tempFooter);

        // dom取得
        const pg_viewer_work_header = getDOM("pg-viewer-work-header")
        const viewr_editor_tbody = getDOM("pg-viewr-editor-body")
        
        // ----------------------------------
        // region kaiso-header
        // ----------------------------------

        // show
        let nameLabel = createDOM("div");
        let pathLabel = createDOM("div");

        // path取得用
        let kaisoCSVString = "";

        // 階層{index}より連結
        for(let tmpIdx = 1; tmpIdx < parseInt(kaisoIndex); tmpIdx++){
            kaisoCSVString += targetObj[`kaiso${tmpIdx}ID`] + ",";
        }

        // idから名称へ変換
        let kaisoPath = "";
        if(kaisoCSVString != ""){

            // ループスコープ外のため最終値が参照されてしまう
            // 固定値保存する必要あり（for(let index... ならスコープ内で毎回宣言されているためOK）
            let loopKaisoIndex = 1;

            for(let tmpId of kaisoCSVString.split(',')){
                if(!tmpId) continue;// 最後のカンマ
                let kaisoName = DATABASE.MASTER[0].MASTER_PGCATEGORY
                                .find(a => a["kaiso" + loopKaisoIndex])
                                ["kaiso" + loopKaisoIndex].find(b => b.id == tmpId)["name"];
                kaisoName = (kaisoPath != "" ? "> " :  "") + kaisoName;
                kaisoPath += kaisoName;

                // リンクパス
                let linkPath = createDOM("span");
                linkPath.innerHTML = kaisoName;
                linkPath.classList.add("pg-path-item");
                pathLabel.appendChild(linkPath);

                // 固定値の保存
                const constIndex = loopKaisoIndex;
                
                // CLICK PATH
                linkPath.addEventListener("click", function(){
                    var maxKaiso = DATABASE.MASTER[0].MASTER_PGCATEGORY.find(a => a.hasOwnProperty("kaisoCount")).kaisoCount;
                    let keyName = "kaiso" + constIndex;
                    var tmpRepo = DATABASE.MASTER[0].MASTER_PGCATEGORY
                                .find(a => a[keyName])[keyName]
                                .find(b => b.id == tmpId);
                    editViewer("KAISO", tmpRepo, (constIndex==maxKaiso), constIndex)
                })

                loopKaisoIndex ++;
            }
        }
        
        // props
        let state = isMaxKaiso ? "所属PG" : "従属階層";
        nameLabel.innerHTML = targetObj.name + `（${state}）`;
        // pathLabel.innerHTML = kaisoPath;
        nameLabel.classList.add("pg-work-title");
        pathLabel.classList.add("pg-work-path");

        // append
        pg_viewer_work_header.appendChild(nameLabel);
        pg_viewer_work_header.appendChild(pathLabel);

        // ----------------------------------
        // region kaiso-body
        // ----------------------------------

        // 従属照会・編集
        let rowNum = 1;

        // 最下層なら所属PG照会
        if(MODE.MAX_KAISO){
            
            for(let tmpObj of DATABASE.MASTER[0].MASTER_PGINFO){

                // 直下のPGのみ取得
                let arr = tmpObj["kaisoCSV"].split(",");
                
                if(arr[arr.length-1] == targetObj["id"]){
                    
                    // table row
                    const tr = createDOM("tr");
                    const td = createDOM("td");
                    const pgnameInput = createDOM("input")
                    const pgidInput = createDOM("input")
                    const td2 = createDOM("td");
                    const td3 = createDOM("td");
                    const delButton = createDOM("button")
                    const pgOpenButton = createDOM("button")
                    const notice = createDOM("span");
                    let taskCount = getTaskCount("PG", tmpObj["id"]);
                    if(taskCount){
                        notice.innerHTML = taskCount;
                        notice.classList.add("notice");
                    }

                    // props
                    td.textContent = rowNum;
                    pgnameInput.type = "text";
                    pgnameInput.value = tmpObj["name"];
                    pgnameInput.style.borderBottom = "none";
                    pgidInput.style.borderTop = "dotted #d4d4d4ff 1px";
                    pgidInput.value = tmpObj["pgid"];
                    delButton.textContent = "削除";
                    delButton.classList.add("medium-button-red");
                    pgOpenButton.textContent = "詳細";
                    pgOpenButton.classList.add("medium-button-dark");
                    
                    // --------------
                    // event
                    // --------------
                    
                    // update name
                    pgnameInput.addEventListener("change", function(){
                        if(this.value.trim()){
                            tmpObj["name"] = this.value;
                        }
                    })
                    // update id
                    pgidInput.addEventListener("change", function(){
                        if(this.value.trim()){
                            tmpObj["pgid"] = this.value;
                        }
                    })
                    // delete data
                    delButton.addEventListener("click", function(){

                        if(confirm(`[${tmpObj["name"]}] を削除しますか？`)){

                            // delete
                            DATABASE.MASTER[0].MASTER_PGINFO = DATABASE.MASTER[0].MASTER_PGINFO.filter(a => a["pgid"] != tmpObj["pgid"]);

                            // upd view
                            editViewer(kbn, targetObj, isMaxKaiso, kaisoIndex);
                        }
                    })
                    // OPEN PG
                    pgOpenButton.addEventListener("click", function(){
                        editViewer("PG",tmpObj)
                    })

                    // append
                    td2.appendChild(pgnameInput);
                    td2.appendChild(pgidInput);
                    td3.appendChild(delButton);
                    td3.appendChild(pgOpenButton);
                    if(taskCount) td3.appendChild(notice);
                    tr.appendChild(td);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    viewr_editor_tbody.appendChild(tr);
                    rowNum++;
                }
            }

        // 直下の階層を表示
        }else{
            
            let arr = DATABASE.MASTER[0].MASTER_PGCATEGORY.find(a=>a[`kaiso${kaisoIndex+1}`])[`kaiso${kaisoIndex+1}`].filter(b=>b[`kaiso${kaisoIndex}ID`]==targetObj["id"]);

            for(let tmpObj of arr){

                // TABLE ROW
                const tr = createDOM("tr");
                const td = createDOM("td");
                const kaisoNameInput = createDOM("input")
                const td2 = createDOM("td");
                const td3 = createDOM("td");
                const delButton = createDOM("button")
                const childOpenButton = createDOM("button")
                const notice = createDOM("span");
                let taskCount = getTaskCount("KAISO", tmpObj["id"]);
                if(taskCount){
                    notice.innerHTML = taskCount;
                    notice.classList.add("notice");
                }
                {
                    td.textContent = rowNum;
                    kaisoNameInput.type = "text";
                    kaisoNameInput.value = tmpObj["name"];
                    kaisoNameInput.style.borderBottom = "none";
                    delButton.textContent = "削除";
                    delButton.classList.add("medium-button-red");
                    childOpenButton.textContent = "詳細";
                    childOpenButton.classList.add("medium-button-dark");
                }

                // --------------
                // EVENT
                // --------------
                
                // UPDATE NAME
                kaisoNameInput.addEventListener("change", function(){
                    if(this.value.trim()){
                        tmpObj["name"] = this.value;
                    }
                })
                // DELETE DATA
                delButton.addEventListener("click", function(){

                    if(confirm(`[${tmpObj["name"]}] を削除しますか？`)){

                        // DELETE KAISO
                        let kaisoKey = "kaiso" + (parseInt(kaisoIndex) + 1);
                        DATABASE.MASTER[0].MASTER_PGCATEGORY.find(a => a[kaisoKey])[kaisoKey] 
                            = DATABASE.MASTER[0].MASTER_PGCATEGORY.find(a => a[kaisoKey])[kaisoKey].filter(a => a["id"] != tmpObj["id"]);

                        // DELETE PG
                        DATABASE.MASTER[0].MASTER_PGINFO = 
                            DATABASE.MASTER[0].MASTER_PGINFO.filter(a => a["kaisoCSV"].split(',')[a["kaisoCSV"].split(',').length-1] != tmpObj["id"]);

                        // UPD VIEW
                        editViewer(kbn, targetObj, isMaxKaiso, kaisoIndex);
                    }
                })
                // OPEN CHILD（階層）
                childOpenButton.addEventListener("click", function(){
                    let tmpIsMaxKaiso = parseInt(kaisoIndex + 1) == parseInt(DATABASE.MASTER[0].MASTER_PGCATEGORY.find(a => a.hasOwnProperty("kaisoCount"))["kaisoCount"]);
                    editViewer("KAISO", tmpObj, tmpIsMaxKaiso, kaisoIndex + 1);
                })

                // APPEND
                td2.appendChild(kaisoNameInput);
                td3.appendChild(delButton);
                td3.appendChild(childOpenButton);
                if(taskCount) td3.appendChild(notice);
                tr.appendChild(td);
                tr.appendChild(td2);
                tr.appendChild(td3);
                viewr_editor_tbody.appendChild(tr);
                rowNum++;
            }
        }
        // ----------------------------------
        // region KAISO-FOOTER
        // ----------------------------------

        // DOM
        let regButton = getDOM("quick_register_viewer");
        let nameBox = getDOM("nameBox_viewer");
        let idBox;
        if(MODE.MAX_KAISO) idBox = getDOM("idBox_viewer");

        // enterフォーカスセットアップ
        if(MODE.MAX_KAISO) setupNextFocus([nameBox, idBox, regButton]);
        else if(MODE.NORMAL_KAISO) setupNextFocus([nameBox, regButton]);

        // REGISTER PGINFO
        if(MODE.MAX_KAISO){
            
            regButton.addEventListener("click", function(){
                
                // どちらか入力
                if(nameBox.value.trim() || idBox.value.trim()){

                    let repo = DATABASE.MASTER[0].MASTER_PGINFO;
                    
                    // PUSH
                    let obj = 
                    {
                        "id": getRandomString20(repo),
                        "pgid":idBox.value.trim(),
                        "name": nameBox.value.trim(),
                        "kaisoCSV":kaisoCSVString + targetObj["id"],
                        "remark": ""
                    };
                    repo.push(obj)

                    // UPD VIEW
                    editViewer(kbn, targetObj, isMaxKaiso, kaisoIndex);

                }else{alert("名称かPGIDを入力してください")}
            })

        // REGISTER KAISO
        }else if(MODE.NORMAL_KAISO){
            regButton.addEventListener("click", function(){
                
                // 必須入力
                if(nameBox.value.trim()){

                    let kaisoKey = "kaiso" + (kaisoIndex + 1);
                    let repo = DATABASE.MASTER[0].MASTER_PGCATEGORY.find(a => a[kaisoKey])[kaisoKey];
                    
                    // DATA
                    let obj = 
                    {
                        "id": getRandomString20(repo),
                        "name": nameBox.value.trim(),
                    };

                    // PARENT ROOT
                    for(let rootIndex = 1; rootIndex <= kaisoIndex; rootIndex++){
                        let val = rootIndex == kaisoIndex
                                    ? targetObj["id"]
                                    : kaisoCSVString.split(',')[rootIndex-1];
                        obj["kaiso" + rootIndex + "ID"] = val;
                    }

                    // PUSH
                    repo.push(obj)

                    // UPD VIEW
                    editViewer(kbn, targetObj, isMaxKaiso, kaisoIndex);

                }else{alert("名称を入力してください")}
            })
        }

        // 初期フォーカス
        nameBox.focus();
            
        // -----------------
        // region PG情報
        // -----------------
        }else if(MODE.PG){
            
            // header
            tempHeader = `<div class="pg-work-header" id="pg-viewer-work-header"></div>`;

            // body（PG VIEW）
            tempBody =
`<div class="like-card-white" id="pg-viewer-work-body" style="height: 70%">

    <!-- TAB -->
    <div class="pg-tab-header">
        <button class="pg-tab active" data-tab="task">タスク</button>
        <button class="pg-tab" data-tab="memo">メモ</button>

        <!-- ADD -->
        <button class="pg-tab-add" id="pg-add-btn">＋</button>
    </div>

    <!-- TAB BODY -->
    <div class="pg-tab-body">

        <!-- ================= -->
        <!-- TASK -->
        <!-- ================= -->
        <div class="pg-tab-panel active" id="pg-tab-task">
            <div class="tag-table-wrapper-viewer">
                <table class="tag-table">
                    <tbody id="task_tbody_viewer"></tbody>
                </table>
            </div>
        </div>

        <!-- ================= -->
        <!-- MEMO -->
        <!-- ================= -->
        <div class="pg-tab-panel" id="pg-tab-memo">

            <!-- PAGE -->
            <div class="pg-memo-header">
                <button class="pg-page-btn">◀</button>
                <div class="pg-memo-date">34/99</div>
                <button class="pg-page-btn">▶</button>
            </div>

            <!-- TITLE -->
            <input
                type="text"
                class="pg-memo-title"
                value="伺書作成メモ"
                placeholder="メモタイトル">

            <!-- BODY -->
            <textarea
                class="pg-memo-body"
                placeholder="本文を入力">
・〇〇部に事前確認  
・金額上限に注意  
・決裁ルート確認
            </textarea>

        </div>

    </div>
</div>`;

        // footer
        tempFooter = 
            `<div class="pg-work-footer" id="pg-viewer-work-footer">
                <div class="pg-work-footer-title">クイック登録</div>
                <div class="pg-work-form">
                    <textarea class="pg-memo-body" style="min-height: 20%" id="contentBox_viewer" placeholder="内容" spellcheck="false"></textarea>
                    <button class="pg-work-add" id="quick_register_viewer">登録</button>
                </div>
            </div>`;

        pg_viewer_work.innerHTML = (tempHeader + tempBody + tempFooter);


        // ----------------------------------------------------------------
        document.querySelectorAll(".pg-tab").forEach(tab => {
            tab.addEventListener("click", () => {
                
                // tab header
                document.querySelectorAll(".pg-tab")
                .forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                
                // tab body
                document.querySelectorAll(".pg-tab-panel")
                .forEach(p => p.classList.remove("active"));
                getDOM("pg-tab-" + tab.dataset.tab).classList.add("active");
            });
        });
        // ----------------------------------------------------------------


        // dom取得
        const pg_viewer_work_header = getDOM("pg-viewer-work-header")
        
        // ----------------------------------
        // region KAISO FOLDER
        // ----------------------------------

        // show
        let nameLabel = createDOM("div");
        let pathLabel = createDOM("div");

        // path取得用
        let kaisoCSVString = targetObj["kaisoCSV"];

        // idから名称へ変換
        let kaisoPath = "";
        if(kaisoCSVString != ""){

            // ループスコープ外のため最終値が参照されてしまう
            // 固定値保存する必要あり
            let loopKaisoIndex = 1;

            for(let tmpId of kaisoCSVString.split(',')){
                if(!tmpId) continue;// 最後のカンマ
                let kaisoName = DATABASE.MASTER[0].MASTER_PGCATEGORY
                                .find(a => a["kaiso" + loopKaisoIndex])
                                ["kaiso" + loopKaisoIndex].find(b => b.id == tmpId)["name"];
                kaisoName = (kaisoPath != "" ? "> " :  "") + kaisoName;
                kaisoPath += kaisoName;

                // リンクパス
                let linkPath = createDOM("span");
                linkPath.innerHTML = kaisoName;
                linkPath.classList.add("pg-path-item");
                pathLabel.appendChild(linkPath);

                // 固定値の保存
                const constIndex = loopKaisoIndex;
                
                // CLICK PATH
                linkPath.addEventListener("click", function(){
                    var maxKaiso = DATABASE.MASTER[0].MASTER_PGCATEGORY.find(a => a.hasOwnProperty("kaisoCount")).kaisoCount;
                    let keyName = "kaiso" + constIndex;
                    var tmpRepo = DATABASE.MASTER[0].MASTER_PGCATEGORY
                                .find(a => a[keyName])[keyName]
                                .find(b => b.id == tmpId);
                    editViewer("KAISO", tmpRepo, (constIndex==maxKaiso), constIndex)
                })
                
                loopKaisoIndex ++;
            }
        }
        
        // props
        nameLabel.innerHTML = targetObj.name;
        // pathLabel.innerHTML = kaisoPath;
        nameLabel.classList.add("pg-work-title");
        pathLabel.classList.add("pg-work-path");

        // append
        pg_viewer_work_header.appendChild(nameLabel);
        pg_viewer_work_header.appendChild(pathLabel);

        // ----------------------------------
        // region KAISO-BODY
        // ----------------------------------

        // DOM
        let task_tbody_viewer = getDOM("task_tbody_viewer");
        let rowCnt = 1;

        // TABLE
        for(let cnt = 1; cnt <= 2; cnt++){

            for(let tmpObj of DATABASE.WORK[0].WORK_TASK){

                // アクセスキー
                let pKey = cnt + "_" + rowCnt

                // 対象のタスクを取得
                if(tmpObj["pgObjId"] != targetObj["id"]) continue;

                // 進捗率（未完了➤完了）
                if(cnt == 1 && parseInt(tmpObj["progress"]) == 100) continue;
                if(cnt == 2 && parseInt(tmpObj["progress"]) != 100) continue;

                // 強調表示
                let bgColor = (cnt==1) ? "background-color: #ffd3d3ff;" : "";

                // ➤表示要否
                let arrowIcon = (parseInt(tmpObj["progress"])==100) ? "" : "➤";

                // TABLE ROW（DOM保持可能なinnerHTML）
                task_tbody_viewer.insertAdjacentHTML("beforeend",
                    `<tr style="width: 100%; ${bgColor}" id="viewer_task_tr_${pKey}">
                        <td>${rowCnt}</td>
                        <td>
                            <input type="range" value="${tmpObj["progress"]}" id="viewer-task-range_${pKey}" min="0" max="100">
                            <div class="task-range-row">
                                <span id="viewer-task-range-num_${pKey}" style="color: #727272ff">${arrowIcon + tmpObj["progress"]}%</span>
                                <button class="mini-btn" onclick="bootSub_taskMemos('${tmpObj["id"]}', true);">メモ</button>
                            </div>
                        </td>
                        <td style="width: 70%">
                            <textarea class="pg-memo-body" style="min-height: 20%; background-color: #fff !important;" id="viewer-task-textarea_${pKey}" spellcheck="false">${tmpObj["content"]}</textarea>
                        </td>
                    </tr>`);

                // ADD EVENT
                let tr = getDOM(`viewer_task_tr_${pKey}`);
                let range = getDOM(`viewer-task-range_${pKey}`);
                let rangeSpan = getDOM(`viewer-task-range-num_${pKey}`);
                let contentBox = getDOM(`viewer-task-textarea_${pKey}`);

                // RANGE
                range.addEventListener("input", function(){

                    // UPD DATA
                    tmpObj["progress"] = `${this.value}`;

                    // UPD VIEW
                    if(this.value==100) {
                        rangeSpan.innerHTML = `${this.value}%`;
                        tr.style.backgroundColor = "#ffff";
                        tmpObj["compDate"] = getToday();
                    }
                    else{ 
                        rangeSpan.innerHTML = `➤${this.value}%`;
                        tr.style.backgroundColor = "#ffd3d3ff";
                        tmpObj["compDate"] = "";
                    }

                    // REOPEN
                    // if(this.value==100) editViewer(kbn, targetObj);
                })

                // CONTENT
                contentBox.addEventListener("change", function(){

                    // UPD DATA
                    tmpObj["content"] = this.value;
                })

                // 連番
                rowCnt++;
            }
        }


        // ----------------------------------
        // region KAISO-FOOTER
        // ----------------------------------

        // DOM
        let regButton = getDOM("quick_register_viewer");
        let contenRegistertBox = getDOM("contentBox_viewer");

        // REGISTER TASK
        regButton.addEventListener("click", function(){
                
            // 必須
            if(contenRegistertBox.value.trim()){

                let repo = DATABASE.WORK[0].WORK_TASK;

                let today = new Date().toISOString().split("T")[0];
                
                // PUSH
                let obj = {
                    "id":getRandomString20(repo),
                    "addedDate":today,
                    "workCategory":"",
                    "pgInfo":kaisoPath + `> ${targetObj["name"]} [${targetObj["pgid"]}]`,
                    "pgObjId":targetObj["id"],
                    "content":contenRegistertBox.value,
                    "dueDate":today,
                    "progress":0,
                    "actHours":0,
                    "compDate":"",
                    "memos":[],
                }
                repo.push(obj)

                // UPD VIEW
                editViewer(kbn, targetObj);

            }else{alert("名称かPGIDを入力してください")}
        })

        // 初期フォーカス
        contenRegistertBox.focus();
    }
}

// =============================================================================
// 関数名  ：onSearchSelect
// 呼び出し：検索結果 選択後処理
// 機能１  ：PGビューアーのワークエリアへ接続
// =============================================================================
function onSearchSelect(searchHidden ,searchBoxId = "", animationMode = true){

    
    let val = searchHidden.value;
    // 結果　："KAISO,KaisoIndex,KaisoObjId"
    // 結果　："PG,PGObjID"

    // DATA
    let kbn = "";
    let kaisoIndex = 0;
    let objId = "";
    let targetObj = null;
    kbn = val.split(",")[0];

    if(kbn == "KAISO"){
        kaisoIndex = val.split(",")[1];
        objId = val.split(",")[2];
        targetObj = DATABASE.MASTER[0].MASTER_PGCATEGORY.find(a => a["kaiso" + kaisoIndex])["kaiso" + kaisoIndex]
                    .find(b => b["id"] == objId);
    }

    if(kbn == "PG"){
        objId = val.split(",")[1];
        targetObj = DATABASE.MASTER[0].MASTER_PGINFO.find(b => b["id"] == objId);
    }

    // 入力復元用
    let prevText = (searchBoxId) ? getDOM(searchBoxId).value : "";
    
    // リビルド変数固定
    rebuildValiable_Viewer = false;

    // ビューアーワークへ表示
    switch(kbn){

        case "KAISO":
            {
                // 再起動
                bootSys_WORK_PGVIEWER(false);

                // ルートの自動クリック
                let treeObjIds = "";
                for(let tmpKaisoIndex = 1; tmpKaisoIndex < kaisoIndex; tmpKaisoIndex++){
                    if(animationMode) treeObjIds += targetObj[`kaiso${tmpKaisoIndex}ID`] + "_button_pgviewer" + ",";
                    else {
                        for(let EName of ["click", "dblclick"]){
                            getDOM(targetObj[`kaiso${tmpKaisoIndex}ID`] + "_button_pgviewer").dispatchEvent(new MouseEvent(EName));
                        }
                    }
                }

                if(animationMode){
                    // PG ELEMENT
                    treeObjIds += targetObj["id"] + "_button_pgviewer";

                    // クリックロボ
                    bootMini_autoRobo(treeObjIds.split(",") , 300, "click,dblclick")

                }else {
                    for(let EName of ["click", "dblclick"]){
                        getDOM(targetObj["id"] + "_button_pgviewer").dispatchEvent(new MouseEvent(EName));
                    }
                }
            }
            break;

        case "PG":
            {
                // 再起動
                bootSys_WORK_PGVIEWER(false);

                // ルートの自動クリック
                let tmpKaisoIndex = 1;
                let treeObjIds = "";
                for(let parentKaisoId of targetObj["kaisoCSV"].split(",")){
                    let kaisoKey = `kaiso${tmpKaisoIndex}`;
                    let kaisoObj = DATABASE.MASTER[0].MASTER_PGCATEGORY
                                    .find(a => a[kaisoKey])[kaisoKey]
                                    .find(b => b["id"] == parentKaisoId);
                    if(animationMode)treeObjIds += kaisoObj["id"] + "_button_pgviewer" + ",";
                    else {
                        for(let EName of ["click", "dblclick"]){
                            getDOM(kaisoObj["id"] + "_button_pgviewer").dispatchEvent(new MouseEvent(EName));
                        }
                    }
                    tmpKaisoIndex++;
                }

                // PG ELEMENT
                let pgDataId = targetObj["id"] + "_button_pgviewer";
                if(animationMode){
                    treeObjIds += pgDataId;

                    // 追加オーダー ※[]でないと"pgDataId"というキー名の宣言になってしまうので注意　中身を参照
                    let order = { [pgDataId] : "click" };

                    // クリックロボ
                    bootMini_autoRobo(treeObjIds.split(",") ,500, "click,dblclick", order)
                
                }else{
                    getDOM(pgDataId).dispatchEvent(new MouseEvent("click"));
                }
            }
            break;
    }

    // 入力復元（再起動により削除されるため 参照ではなくID渡し）
    if(searchBoxId) getDOM(searchBoxId).value = prevText;

    // リビルド変数固定
    rebuildValiable_Viewer = true;
}

//#region ワーク-タスク管理（起動）*********************************************************************************************************************************

// viewer ref button
const refButton_viewr_taskManager = getDOM("refButton_viewr_taskManager");
// added date
const added_date_taskManager = getDOM("added_date_taskManager");
// work category
const work_category_select_taskManager = getDOM("work_category_select_taskManager");
// PG info
const pgInfo_input_taskManager = getDOM("pgInfo_input_taskManager");
// content input
const content_input_taskManager = getDOM("content_input_taskManager");
// due date
const due_date_taskManager = getDOM("due_date_taskManager");
// register buttn
const register_button_taskManager = getDOM("register_button_taskManager");
// clearButton_pginfo_taskManager
const clearButton_pginfo_taskManager = getDOM("clearButton_pginfo_taskManager");
// hidden id （PGIDではなくPG情報のID）
const pgid_hidden_taskManager = getDOM("pgid_hidden_taskManager");
// tbody
const tbody_taskTable = getDOM("tbody_taskTable");
// th
const sample_th_taskManager = getDOM("sample-th-taskManager");
// second th
const second_th_row_taskManager = getDOM("second-th-row-taskManager");
// condition date
const task_condition_date = getDOM("task_condition_date");
// 検索用PGID隠しボックス
const contidionBox_pgid_hidden = getDOM("contidionBox_pgid_hidden");
// 内容検索ボックス
const contidionBox_content = getDOM("contidionBox_content");
{
    contidionBox_content.addEventListener("input", function(){
        bootSys_WORK_TASK();
    })
}

function bootSys_WORK_TASK(isFirst=false){

    // Init **

    // 作業カテゴリ再生成
    work_category_select_taskManager.innerHTML = createDOM_workCategory().innerHTML;

    // 追加日・期日初期値
    let today = "";
    {
        const now = new Date(); 
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        today = `${year}-${month}-${day}`;
    }
    added_date_taskManager.value = today;
    due_date_taskManager.value = today;

    // visible register form
    getDOM("register-form-taskManager").hidden = true;
    getDOM("table-container-task-manager").style.height = "60vh";

    // table**
    function buildTable(){
        // clear
        tbody_taskTable.innerHTML = "";

        // clone for work
        let cloneRepo = DATABASE.WORK[0].WORK_TASK;

        // create
        let index = 1;
        for(let obj of cloneRepo){
            // tr1（No、追加日、進捗、期日、実績工数、完了日）
            {
                // condition
                {
                    // 追加日
                    if(task_condition_date.value != ""){
                        if(obj["addedDate"] != task_condition_date.value) continue;
                    }
                    // 対象PG
                    if(contidionBox_pgid_hidden.value != ""){
                        try{
                            if(obj["pgObjId"] != contidionBox_pgid_hidden.value) continue;
                        }catch(e){continue};
                    }
                    // 内容（大文字、小文字統一）
                    if(contidionBox_content.value != ""){
                        if(!obj["content"].toUpperCase().includes(contidionBox_content.value.toUpperCase())) continue;
                    }
                }
                const tr = createDOM("tr");
                if(!(index%2==0)) tr.style.backgroundColor = "#e7edff";
                for(let col = 1; col <= 6; col++){
                    const td = createDOM("td");
                    switch(col){
                        // No
                        case 1:{
                            td.rowspan = "2";
                            td.textContent = index;
                            break;
                        }
                        // 追加日
                        case 2:{
                            const label = createDOM("label");
                            const span = createDOM("span");
                            const today = new Date();
                            var dateTmp;
                            if(obj["addedDate"] == today.toISOString().slice(0, 10))
                            {
                                // span.style.fontWeight = "bold";
                                dateTmp = "今日";
                            }else{
                                dateTmp = obj["addedDate"].replaceAll('-','/');
                            }
                            span.style.color = "#dd6464ff";
                            span.textContent = dateTmp;
                            label.textContent = "追加日：";
                            label.appendChild(span)
                            td.appendChild(label)
                            // td.appendChild(input)
                            break;
                        }
                        // 進捗
                        case 3:{
                            const range = createDOM("input");
                            const label = createDOM("label");
                            range.type = "range";
                            range.style.width = "50%";
                            range.min = "0";
                            range.max = "100";
                            range.value = obj["progress"];
                            label.textContent = `${obj["progress"]}%`;
                            td.style.display = "flex";
                            td.appendChild(range);
                            td.appendChild(label);
                            {
                                range.addEventListener("input", function(){
                                    label.textContent = `${this.value}%`;
                                    obj["progress"] = this.value;
                                    // 完了日更新
                                    if(parseInt(this.value) == 100){
                                        obj["compDate"] = getToday();
                                    }else{
                                        obj["compDate"] = "";
                                    }
                                })
                            }
                            break;
                        }
                        // 期日
                        case 4:{
                            const label = createDOM("label");
                            const input = createDOM("input");
                            input.type = "date";
                            input.value = obj["dueDate"];
                            input.style.width = "40%";
                            label.textContent = "期日：";
                            if(!(index%2==0)) input.style.backgroundColor = "#e7edff";
                            td.appendChild(label)
                            td.appendChild(input)
                            {
                                // event
                                input.addEventListener("change", function(e){
                                    obj["dueDate"] = this.value;
                                })
                            }
                            break;
                        }
                        // 実績工数
                        case 5:{
                            const input = createDOM("input");
                            const label = createDOM("label");
                            input.type = "number";
                            input.step = "0.5";
                            input.min = "0";
                            input.value = obj["actHours"];
                            if(!(index%2==0)) input.style.backgroundColor = "#e7edff";
                            label.textContent = "h";
                            label.style.marginLeft = "5px";
                            td.style.display = "flex";
                            td.appendChild(input);
                            td.appendChild(label);
                            {
                                // event
                                input.addEventListener("change", function(e){
                                    obj["actHours"] = this.value;
                                })
                            }
                            break;
                        }
                        // 完了日
                        case 6:{
                            const input = createDOM("input");
                            input.type = "date";
                            if(!(index%2==0)) input.style.backgroundColor = "#e7edff";
                            input.value = obj["compDate"];
                            td.appendChild(input);
                            {
                                // event
                                input.addEventListener("change", function(e){
                                    obj["compDate"] = this.value;
                                })
                            }
                            break;
                        }
                    }
                    tr.appendChild(td);
                }
                tbody_taskTable.appendChild(tr);
            }
            // tr2（作業カテゴリ、対象PG、内容、作業メモ、操作）
            {
                const tr = createDOM("tr");
                if(!(index%2==0)) tr.style.backgroundColor = "#e7edff";
                for(let col = 1; col <= 6; col++){
                    const td = createDOM("td");
                    switch(col){
                        // 空行
                        case 1:{
                            break;
                        }
                        // 作業カテゴリ
                        case 2:{
                            try{
                                let tmp = DATABASE.MASTER[0].MASTER_WORKCATEGORY.find(a => a.id == obj["workCategory"])["name"];
                                td.textContent = tmp;
                            }catch(e){
                                td.textContent = "ー";
                            }
                            break;
                        }
                        // 対象PG
                        case 3:{
                            const label = createDOM("label");
                            label.textContent = obj["pgInfo"] ? obj["pgInfo"] : "ー";
                            if(obj["pgInfo"]){
                                // label.style.color = "#2361a8ff";
                                // label.style.textDecoration = "underline";
                                label.style.cursor = "pointer";
                                label.addEventListener("click", function(e){
                                    // bootSub_memoLink
                                })
                            }
                            td.addEventListener("dblclick", function(){
                                if(obj["pgInfo"]){
                                    try{
                                        let pgid = DATABASE.MASTER[0].MASTER_PGINFO.find(a => a.id == obj["pgObjId"])["pgid"];
                                        navigator.clipboard.writeText(pgid).then(() => {
                                            log(`クリップボードにコピーしました [${pgid}]`);
                                        });
                                    }catch(e){}
                                }
                            })
                            td.appendChild(label);
                            break;
                        }
                        // 内容
                        case 4:{
                            const input = createDOM("input");
                            input.type = "text";
                            input.placeholder = "内容...";
                            input.value = obj["content"];
                            if(!(index%2==0)) input.style.backgroundColor = "#e7edff";
                            td.appendChild(input);
                            {
                                // event
                                input.addEventListener("change", function(e){
                                    obj["content"] = this.value;
                                })
                            }
                            break;
                        }
                        // 作業メモ
                        case 5:{
                            const button = createDOM("button");
                            button.textContent = "開く";
                            button.classList.add("mini-btn");
                            td.appendChild(button);
                            button.addEventListener("click", function(){
                                // 作業メモ画面を開く
                                bootSub_taskMemos(obj["id"]);
                            })
                            break;
                        }
                        // 操作
                        case 6:{
                            const button = createDOM("button");
                            button.textContent = "削除";
                            button.classList.add("medium-button-red");
                            td.appendChild(button);
                            {
                                // event
                                button.addEventListener("click", function(){
                                    if(confirm("タスクを削除しますか？")){
                                        // cloneRepo自体を上書きする場合は参照更新不可っぽい
                                        DATABASE.WORK[0].WORK_TASK = cloneRepo.filter(a => a["id"] != obj["id"]);
                                        buildTable();
                                        log("タスクを削除しました");
                                    }
                                })
                            }
                            break;
                        }
                    }
                    tr.style.borderBottom = "solid gray 2px";
                    tr.appendChild(td);
                }
                tbody_taskTable.appendChild(tr);
            }

            // top
            let rect = sample_th_taskManager.getBoundingClientRect();
            for(let element of second_th_row_taskManager.children){
                // rowspan == 2
                element.style.top = rect.height/2 + "px";
            }

            // inc
            index ++;

            // scroll
            document.getElementById("task-Manager-table-wrapper").scrollTop = document.getElementById("task-Manager-table-wrapper").scrollHeight;

        }
        // hit count
        getDOM("task_kensu_label").textContent = `（${index-1}件）`;
    }
    buildTable();

    // not first**
    if(!isFirst){
        return;
    }

    // reference from viewer
    refButton_viewr_taskManager.addEventListener("click", function(e){
        // bootSub reference
        bootSub_refViewer(pgInfo_input_taskManager, pgid_hidden_taskManager);
    });

    // clear
    clearButton_pginfo_taskManager.addEventListener("click", function(){
        pgInfo_input_taskManager.value = "";
        pgid_hidden_taskManager.value = "";
    })

    // register
    register_button_taskManager.addEventListener("click", function(){
        register();
    })

    // register
    function register(){

        // check
        if(!pgInfo_input_taskManager.value.trim() && !content_input_taskManager.value.trim()){
            alert("対象PG情報か内容のどちらかを入力してください");
            return;
        }

        // unique id
        var let = false;
        var uniqueID = getRandomString20();
        while(!let){
            let = true;
            if(DATABASE.WORK[0].WORK_TASK.some(b => b.id == uniqueID) ){ // someは配列用メソッド
                let = false;
                uniqueID = getRandomString20();
            }
            if(let) break;
        }

        // obj
        let obj = {
            "id":uniqueID,
            "addedDate":added_date_taskManager.value,
            "workCategory":work_category_select_taskManager.value,
            "pgInfo":pgInfo_input_taskManager.value,
            "pgObjId":pgid_hidden_taskManager.value,
            "content":content_input_taskManager.value,
            "dueDate":due_date_taskManager.value,
            "progress":0,
            "actHours":0,
            "compDate":"",
            "memos":[],
        }
        // push
        DATABASE.WORK[0].WORK_TASK.push(obj);

        // log
        log("タスクを登録しました");

        //clear
        work_category_select_taskManager.value = "";
        pgInfo_input_taskManager.value = "";
        pgid_hidden_taskManager.value = "";
        content_input_taskManager.value = "";
        added_date_taskManager.value = today;
        due_date_taskManager.value = today;

        // rebuild
        buildTable();
    }

}




// region ワーク-雑多メモ *******************************************************************************************************************************

// dom

let keyId_memo = "";
// 操作ログオブジェクト
let logObj_memo = {
//     sheetId: 
//     [
//         {"type":controllTypes.CREATE, "targetID": sjhdfuhas},{}
//     ], 
//     sheetId: 
//     [
//          ...
//     ],
}; 
// 操作種別
let controllTypes = {
    "CREATE":1,
    "DELETE":2,
}
// エクスプローラー
const exp_memo = getDOM("exp_memo");
// ツリー
const tree_memo = getDOM("tree_memo");
// ファイル名
const fileNameBox_memo = getDOM("fileNameBox_memo");
// パスラベル
const pathLabel_memo = getDOM("pathLabel_memo");
// メモテキストエリア
const memoTextarea_memo = getDOM("memoTextarea_memo");
{
    memoTextarea_memo.addEventListener("change", function(){
        if(keyId_memo!=""){
            DATABASE.WORK[0].WORK_MEMO.find(a=>a["id"]==keyId_memo)["content"] = this.value;
        }
    })
    // 高度な編集機能を提供
    attachRichEditFunction(memoTextarea_memo);
}
// メモシートDIV
const memoSheet_memo = getDOM("memoSheet_memo");
// 検索ボックス
const memoSearchInput = getDOM("memoSearchInput");
{
    memoSearchInput.addEventListener("input", function()
    {
        bootSys_WORK_MEMO(false, true);
    })
}

//*雑多メモーbootSys********************************************************************* ************/
function 
bootSys_WORK_MEMO(isFirst, blnRebuild = false){
    if(isFirst){
        // イベント付与
        exp_memo.addEventListener("contextmenu",function(e){
            // 右クリックメニュー
            e.preventDefault();
            let orderArr = [
                {"printName":"フォルダを作成", "icon":svg_folder, "func":()=> createExpObj_memo( {"type": "folder", "parent": null} ), },
                // {"printName":"シートを作成", "icon":svg_CrossWord, "func":()=> createExpObj_memo( {"type": "sheet", "parent": null} ), },
                {"printName":"ノートを作成", "icon":svg_file, "func":()=> createExpObj_memo( {"type": "file", "parent": null} ), },
            ];
            createMenu(orderArr);
        })
        // ダブルクリックでファイルクイック作成
        exp_memo.addEventListener("dblclick",function(e){
            createExpObj_memo( {"type": "file", "parent": null} )
        })
    }
    // マスタデータが絡まないため、データ読み込み時のみリビルト
    if(blnRebuild) rebuild_memo();
}
// 再構築
function rebuild_memo()
{
    {
        // clear
        keyId_memo = ""; // 先にキークリア
        tree_memo.innerHTML = "";
        fileNameBox_memo.value = "";
        pathLabel_memo.textContent = "";
        memoTextarea_memo.value = "";
        memoSheet_memo.hidden = true;
        memoTextarea_memo.hidden = true;
    }
    // 親から生成できるようソート（破壊的メソッド）
    DATABASE.WORK[0].WORK_MEMO.sort((a, b) => {
        return a.parentCSV.split(',').length - b.parentCSV.split(',').length;
    });
    // フォルダから生成------------------------------------------------------------------------
    let createdArr = "";
    for(let objType of ["folder","file"]){
        let repo = DATABASE.WORK[0].WORK_MEMO.filter(a => a["type"]==objType);
        for(let obj of repo)
        {
            if(!memoSearchInput.value) createExpObj_memo(obj, true)
            else
            {
                // 検索ワード絞込み------------------------------------------------------------------------
                let condition = memoSearchInput.value.toLowerCase();
                let beCreate = false;
                if(obj["name"].toLowerCase().includes(condition)) beCreate = true;
                if(obj["type"]=="file")
                {
                    if(obj["content"].toLowerCase().includes(condition)) beCreate = true;
                }
                if(beCreate) 
                {
                    // 先に親フォルダを作成
                    for(let parentID of obj["parentCSV"].split(','))
                    {
                        let parObj = DATABASE.WORK[0].WORK_MEMO.find(a => a["id"] == parentID && a["id"] != obj["id"])
                        if(parObj && !createdArr.includes(parObj["id"])) 
                        {
                            createExpObj_memo(parObj, true);
                            createdArr += parObj["id"] + ",";
                        };
                    }
                    // 対象を作成
                    if(!createdArr.includes(obj["id"]))
                    {
                        createExpObj_memo(obj, true);
                        createdArr += obj["id"] + ",";
                    }
                    // フォルダなら子も作成
                    if(obj["type"]=="folder")
                    {
                        let chArr = DATABASE.WORK[0].WORK_MEMO.filter(a => a["parentCSV"].includes(obj["id"]) && a["id"] != obj["id"])
                        if(chArr){
                            for(let chObj of chArr)
                            {
                                if(!createdArr.includes(chObj["id"]))
                                {
                                    createExpObj_memo(chObj, true);
                                    createdArr += chObj["id"] + ",";
                                }
                            }
                        }
                    }
                };
                //------------------------------------------------------------------------
            }
        }
    }
    //------------------------------------------------------------------------
}
// 開いているフォルダをカンマ区切りで格納・展開（"SAVE" OR "OPEN"）
let openingFolderIDs = "";
function saveAndOpenFolder_memo(pmode, activeID = "")
{
    switch(pmode)
    {
        //--------------------
        case "SAVE" : 
            
            // クリア
            openingFolderIDs = "";

            // 従属があるもののみ取得
            for(let repo of DATABASE.WORK[0].WORK_MEMO)
            {
                let memoID = repo["id"];
                let chArr = DATABASE.WORK[0].WORK_MEMO.filter(a =>a["parentCSV"].includes(memoID) && a["parentCSV"] != memoID);
                if(chArr && chArr.length) 
                {
                    let el = getDOM(`${memoID}_expObj_memo`);
                    if(el && !el.hidden) openingFolderIDs += `${memoID},`
                };
            }
        break;
        //--------------------
        case "OPEN" :

            if(activeID) openingFolderIDs += `${activeID},`
            for(let tmpId of openingFolderIDs.split(','))
            {
                if(!tmpId) continue;
                let el = getDOM(`${tmpId}_expObj_memo`);
                if(el) el.dispatchEvent(new MouseEvent("click"));
            }
        break;
    }
}

// メニュー呼び出し用にパブリックスコープにて宣言
// メニュー作成（）
function createExpObj_memo(obj, isRebuild = false, pElName = ""){

    if(isRebuild){
        createObjDOM(obj, obj["name"], true);
        return;
    }
    var typeName = "";
    switch(obj["type"]){
        
        case "folder":
            typeName = "フォルダ"
            break;
        case "sheet":
            typeName = "シート"
            break;
        case "file":
            typeName = "ノート"
            break;
    }
    var objName = "";
    // 指定名称
    if(pElName){
        objName = pElName;
    }else{
        objName = prompt(`${typeName}名を入力してください ※カンマ区切り`, `空白の${typeName}`);
    }
    if(!objName || !(objName.trim())) return;
    // カンマ区切り
    for(let name of objName.split(',')){
        if(name.trim() == "") continue;
        createObjDOM(obj, name, false);
    }
    // ソート
    saveAndOpenFolder_memo("SAVE");
    rebuild_memo();
    saveAndOpenFolder_memo("OPEN");
    
    // 画面構築
    function createObjDOM(obj, name, isRebuild){

        const objId = getRandomString20(DATABASE.WORK[0].WORK_MEMO);
        let parent;

        // 親設定
        if(!isRebuild){
            parent = obj["parent"] ? obj["parent"] : tree_memo;
        }else{
            // パスから自身を省いたものが親domのid
            parent = obj["parentCSV"].split(',').length > 1 ? getDOM( obj["parentCSV"].replace(`,${obj["id"]}`, "")) : tree_memo;
        }
        const container = createDOM("div");
        const li = createDOM("li");
        const icon = createDOM("span");
        {
            // idにparentCSVを設定
            if(isRebuild){
                container.id = obj["parentCSV"];
            }else{
                if(obj["parent"]){
                    container.id = obj["parent"].id + "," + objId; //*** */
                }else{
                    container.id = objId; //*** */
                }
            }
            // メモ階層
            let memoKaiso = container.id.split(",").length;
            if(obj["type"] == "folder"){
                li.classList.add("folder");
            }else{
                li.classList.add("file");
            }
            li.textContent = (obj["type"] == "folder" ? "📁" : "📄") + name;
            li.style.display = "flex";
            icon.classList.add("iconButton")
            if(obj["type"]=="folder") {
                // icon.innerHTML = svg_folder_black;
            }else if(obj["type"]=="file"){
                // icon.innerHTML = svg_file_black;
            }else if(obj["type"]=="sheet"){
                // icon.innerHTML = svg_CrossWord_gray;
            }
            icon.style.marginRight = "5px";
            container.classList.add("pgviewer-kaisofolder-container");
            container.style.marginLeft = "15px";
            // // マージンブロック
            // if(memoKaiso > 1){
            //     let marginBlock = createDOM("button");
            //     marginBlock.classList.add("marginBlock");
            //     marginBlock.textContent = "margin"
            //     container.appendChild(marginBlock)
            // }
            // 最上階層以外初期非表示
            if(isRebuild){
                if(obj["parentCSV"].split(',').length > 1){
                    container.hidden = true;
                }
            }
        }
        // statusIcon
        let statusIcon = createDOM("span");
        if(isRebuild && obj["statusIcon"]!=null) {
            statusIcon.innerHTML = obj["statusIcon"].replace(`fill="#F3F3F3"`,`fill="#383838ff"`);;
            {
                statusIcon.classList.add("iconButton");
                statusIcon.style.marginLeft = "auto";
            }
        }
        let dataObj = null;
        if(!isRebuild){
            // crate Data
            dataObj = 
            {
                "type": obj["type"],
                "name": name,
                "content":"",
                "id": objId,
                "parentCSV": container.id,
                "sortNo":0,
                "statusIcon":null,
            }
            DATABASE.WORK[0].WORK_MEMO.push(dataObj);
        }else dataObj = obj;
        const id = isRebuild ? obj["id"] : objId;

        // liにID付与
        li.id = `${dataObj["id"]}_expObj_memo`;

        // event
        if(obj["type"]=="folder"){
            // folder
            li.addEventListener("click", function(e){
                // 開閉
                for(let child of this.parentElement.children){
                    if(child != this && child != this.child){
                        // child.style.display = child.style.display=="none" ? "block" : "none";
                        child.hidden = !child.hidden;
                    }
                }
            });
            for(let EName of ["contextmenu", "dblclick"]){

                li.addEventListener(EName, function(e){

                    if(EName == "contextmenu"){
                        // 右クリックメニュー
                        e.preventDefault();
                        let orderArr = [
                            {"printName":"フォルダを作成", "icon":svg_folder, "func":()=> createExpObj_memo( {"type": "folder", "parent": container} ), },
                            // {"printName":"シートを作成", "icon":svg_CrossWord, "func":()=> createExpObj_memo( {"type": "sheet", "parent": container} ), },
                            {"printName":"ノートを作成", "icon":svg_file, "func":()=> createExpObj_memo( {"type": "file", "parent": container} ), },
                            {"printName":"リネーム", "icon":svg_pencil, "func":()=>rename_memo(id,li), },
                            {"printName":"削除", "icon":svg_gabage, "func":()=>delete_memo(id, container), },
                        ];
                        createMenu(orderArr);

                    }else if(EName == "dblclick"){
                        // リネーム
                        // rename_memo(id,li);
                    }
                    // 開ける（開閉状態を統一するため）
                    this.dispatchEvent(new MouseEvent("click"));
                    for(let child of this.parentElement.children){
                        if(child != this && child != this.child){ // button, svg
                            child.hidden = false;
                        }
                    }
                    e.stopPropagation();
                });
            }
        }else if(obj["type"]=="file"){
            // file
            li.addEventListener("contextmenu", function(e){
                // 右クリックメニュー
                e.preventDefault();
                this.dispatchEvent(new MouseEvent("click"));
                let orderArr = [
                    {"printName":"アイコン", "icon":svg_category, "func":()=>statusIcon_memo(id, li), },
                    {"printName":"リネーム", "icon":svg_pencil, "func":()=>rename_memo(id,li), },
                    {"printName":"削除", "icon":svg_gabage, "func":()=>delete_memo(id, container), },
                ];
                createMenu(orderArr);
                e.stopPropagation();
            });
            li.addEventListener("dblclick", function(e){
                // ダブルクリックでリネーム
                e.stopPropagation();
                rename_memo(id,li);                
            });
            li.addEventListener("click", function(e)
            {
                // visible
                memoTextarea_memo.hidden = false;
                memoSheet_memo.hidden = true;

                keyId_memo = id;
                fileNameBox_memo.value = DATABASE.WORK[0].WORK_MEMO.find(a=>a["id"]==id)["name"];
                memoTextarea_memo.value = DATABASE.WORK[0].WORK_MEMO.find(a=>a["id"]==id)["content"];
                let strPath = "";
                for(let tmp of DATABASE.WORK[0].WORK_MEMO.find(a=>a["id"]==id)["parentCSV"].split(`,`)){
                    if(tmp!=id){
                        strPath += `${strPath=="" ? "" : "> "}${DATABASE.WORK[0].WORK_MEMO.find(a=>a["id"]==tmp)["name"]}`;
                    }
                }
                pathLabel_memo.textContent = strPath;
                // class
                for (let element of document.getElementsByClassName("selected-tree-obj-memo")){
                    element.classList.remove("selected-tree-obj-memo");
                }
                this.classList.add("selected-tree-obj-memo");

                // 直親　li + container　を選択状態にする--------------------------------------------
                document
                    .querySelectorAll(
                        ".selected-tree-obj-folder-memo, .selected-tree-obj-container-memo, .selected-tree-obj-topcontainer-memo"
                    )
                    .forEach(el => el.classList.remove(
                        "selected-tree-obj-folder-memo",
                        "selected-tree-obj-container-memo",
                        "selected-tree-obj-topcontainer-memo"
                    ));

                let parentIDsArr = dataObj["parentCSV"].split(',');
                if(parentIDsArr.length >= 2)
                {
                    try{
                        // 直親コンテナ
                        getDOM(`${parentIDsArr[parentIDsArr.length-2]}_expObj_memo`).parentElement.classList.add("selected-tree-obj-container-memo");
                        getDOM(`${parentIDsArr[parentIDsArr.length-2]}_expObj_memo`).classList.add("selected-tree-obj-folder-memo");
                        // 全親li
                        for(let loopParentId of parentIDsArr)
                        {
                            if(loopParentId != dataObj["id"]) getDOM(`${loopParentId}_expObj_memo`).classList.add("selected-tree-obj-folder-memo");
                            if(loopParentId != dataObj["id"]) getDOM(`${loopParentId}_expObj_memo`).parentElement.classList.add("selected-tree-obj-topcontainer-memo");
                        }
                    }catch(e){};
                }
                //--------------------------------------------
            });
        // シート
        }else if(obj["type"]=="sheet"){
            // // sheet
            // li.addEventListener("contextmenu", function(e){
            //     // 右クリックメニュー
            //     e.preventDefault();
            //     let orderArr = [
            //         {"printName":"アイコン", "icon":svg_category, "func":()=>statusIcon_memo(id, li), },
            //         {"printName":"リネーム", "icon":svg_pencil, "func":()=>rename_memo(id,li), },
            //         {"printName":"削除", "icon":svg_gabage, "func":()=>delete_memo(id, container), },
            //     ];
            //     createMenu(orderArr);
            //     e.stopPropagation();
            // });
            // li.addEventListener("click", function(e){
            //     // visible
            //     memoTextarea_memo.hidden = true;
            //     memoSheet_memo.hidden = false;

            //     keyId_memo = id;
            //     fileNameBox_memo.value = DATABASE.WORK[0].WORK_MEMO.find(a=>a["id"]==id)["name"];
            //     let strPath = "";
            //     for(let tmp of DATABASE.WORK[0].WORK_MEMO.find(a=>a["id"]==id)["parentCSV"].split(`,`)){
            //         if(tmp!=id){
            //             strPath += `${strPath=="" ? "" : "> "}${DATABASE.WORK[0].WORK_MEMO.find(a=>a["id"]==tmp)["name"]}`;
            //         }
            //     }
            //     pathLabel_memo.textContent = strPath;
                
            //     // class
            //     for (let element of document.getElementsByClassName("selected-tree-obj-memo")){
            //         element.classList.remove("selected-tree-obj-memo");
            //     }
            //     this.classList.add("selected-tree-obj-memo");
            // });
        }
        
        // 下層カウンタ
        let counter = createDOM("span");
        {
            // スタイル
            counter.style.border = "solid #d3d3d3 1px";
            counter.style.padding = "2px 8px";
            counter.style.fontSize = "12px";
            counter.style.marginLeft = "8px";
        }
        if(isRebuild)
        {
            // FOLDER
            if(obj["type"]=="folder")
            {
                // このIDをパスに含む要素を取得
                let thisId = obj["id"];
                let chArr = DATABASE.WORK[0].WORK_MEMO
                .filter(a=>a["parentCSV"].includes(thisId) && a["parentCSV"] != thisId);

                // 直下のみ
                if(chArr) chArr = chArr.filter(a => a["parentCSV"].split(',')[a["parentCSV"].split(',').length-2]==thisId);
                let childCnt = chArr ? chArr.length : 0;

                // STYLE
                // counter.style.backgroundColor = "#2f3b48";  // 淡いブルーグレー
                // counter.style.color = "#eeeeee";            // 本文と同系
                counter.style.backgroundColor = "#eeeeee";  // 淡いブルーグレー
                counter.style.color = "#2f3b48";            // 本文と同系
                counter.style.borderRadius = "0px 10px 10px 0px";
                counter.innerHTML = `${childCnt}件`;
                li.appendChild(counter);
            }
            // NOTE
            else
            {
                // STYLE
                counter.style.backgroundColor = "#eeeeee";  // 淡いブルーグレー
                counter.style.color = "#2f3b48";            // 本文と同系
                counter.style.borderRadius = "10px 0px 10px 0px";
                counter.innerHTML = `Note`;
                // li.appendChild(counter);
            }
        }

        // APPEND
        li.prepend(icon);
        if(isRebuild) li.appendChild(statusIcon)
        container.appendChild(li);
        parent.appendChild(container);
    }
}
// delete
function delete_memo(objId, container){
    // data
    if(confirm(`[${DATABASE.WORK[0].WORK_MEMO.find(a=>a["id"]==objId)["name"]}]を削除しますか？`)){
        DATABASE.WORK[0].WORK_MEMO = DATABASE.WORK[0].WORK_MEMO.filter(a => !a["parentCSV"].includes(objId));
        container.remove();
        {
            // clear
            keyId_memo = ""; // 先にキークリア
            fileNameBox_memo.value = "";
            pathLabel_memo.textContent = "";
            memoTextarea_memo.value = "";
            memoSheet_memo.hidden = true;
            memoTextarea_memo.hidden = true;
        }
    }
}
// rename
function rename_memo(objId, li=null){
    // data
    let elObj = DATABASE.WORK[0].WORK_MEMO.filter(a => a["id"] == objId);
    let newName = prompt("新しい名称を入力してください", elObj[0]["name"]);
    if(newName && newName.trim()){
        DATABASE.WORK[0].WORK_MEMO.find(a=>a["id"]==objId)["name"] = newName;
        saveAndOpenFolder_memo("SAVE");
        rebuild_memo();
        saveAndOpenFolder_memo("OPEN");
        // const icon = createDOM("span");
        // {
        //     // icon.innerHTML = (DATABASE.WORK[0].WORK_MEMO.find(a => a.id == objId)["type"]=="file" ? svg_file_black : svg_folder_black);
        //     icon.classList.add("iconButton");
        //     icon.style.marginRight = "5px";
        // }
        // let statusIcon = createDOM("span");
        // if(DATABASE.WORK[0].WORK_MEMO.find(a => a.id == objId)["statusIcon"] != null){
        //     statusIcon.innerHTML = DATABASE.WORK[0].WORK_MEMO.find(a => a.id == objId)["statusIcon"].replace(`fill="#F3F3F3"`,`fill="#383838ff"`);
        //     statusIcon.classList.add("iconButton");
        //     statusIcon.style.marginLeft = "auto";
        // }
        // li.textContent = newName;
        // li.appendChild(statusIcon);
        // li.prepend(icon);
    }
}
// status icon
function statusIcon_memo(objId, li){
    let obj = DATABASE.WORK[0].WORK_MEMO.find(a => a["id"]==objId);
    // ※色はreplace変換するため#F3F3F3のみ可能
    let orderArr = [
        {"icon":svg_lock, "printName":(obj["statusIcon"] == svg_lock ? "ロック   ✓" : "ロック"), "func":() => upd_status_memo(obj, svg_lock, li)},
        {"icon":svg_code, "printName":(obj["statusIcon"] == svg_code ? "コード ✓" : "コード"), "func":() => upd_status_memo(obj, svg_code, li)},
        {"icon":svg_edit, "printName":(obj["statusIcon"] == svg_edit ? "編集中 ✓" : "編集中"), "func":() => upd_status_memo(obj, svg_edit, li)},
        {"icon":svg_calendar, "printName":(obj["statusIcon"] == svg_calendar ? "管理 ✓" : "管理"), "func":() => upd_status_memo(obj, svg_calendar, li)},
    ];
    createMenu(orderArr);
}
// update icon data
function upd_status_memo(obj, newSvg, li){
    // clear
    var cnt = 0;
    for(let tmp of li.children){
        if(tmp.classList.contains("iconButton")){
            // ファイルアイコンを退避
            if(cnt >= 1)tmp.remove();
            cnt++;
        }
    }
    if(obj["statusIcon"] == newSvg){
        // clear
        obj["statusIcon"] = null;
    }else{
        // set
        obj["statusIcon"] = newSvg;
        let icon = createDOM("span");
        {
            icon.innerHTML = newSvg.replace(`fill="#F3F3F3"`,`fill="#383838ff"`);
            icon.classList.add("iconButton");
            icon.style.marginLeft = "auto";
        }
        li.appendChild(icon);
    }
}
//=======================
// シートイベント
//=======================

// クリック
memoSheet_memo.addEventListener("click", function(e){
    // e.stopPropagation();
    if(!keydown("Shift")) createInput_sheet(e);
})
// 右クリック
memoSheet_memo.addEventListener("contextmenu", function(e){
    e.preventDefault();
    let orderArr = [
        {"icon":svg_pencil, "printName":(lineMode ? "ラインモード   ✓" : "ラインモード"), "func":() => toggle_LineMode()},
        {"icon":svg_magnet, "printName":"吸着範囲", "func":() => change_snapRange()},
    ];
    createMenu(orderArr);
})

function createInput_sheet(e, top = null, left = null){
    // クリックでテキスト挿入
    const textarea = createDOM("textarea");
    let pos = getPosition(e, memoSheet_memo);
    {
        // prop
        textarea.classList.add("box-trans");
        textarea.classList.add("box-not-focus");
        textarea.style.resize = "none";
        textarea.style.fontSize = "16px";
        textarea.style.position = "absolute";
        textarea.style.fontSize = "16px";
        // 相対マウス位置
        textarea.style.top = (top ? top : pos.y) + "px";
        textarea.style.left = (left ? left : pos.x) + "px";
        textarea.spellcheck = false; 
        textarea.autoComplete = false; 
        mouseDrag(textarea);
    }
    {
        // ロストフォーカス
        textarea.addEventListener("blur",function(e){
            if(this.value.replaceAll("\n","") == "") this.remove();
        })
        // クリック
        textarea.addEventListener("click",function(e){
            e.stopPropagation();
        })
        // ホバー
        textarea.addEventListener("mouseenter",function(e){
            if(keydown("Shift")) this.classList.add("soft-borer");
        })
        // ホバー終了
        textarea.addEventListener("mouseleave",function(e){
            this.classList.remove("soft-borer");
        })
        // オードリサイズ（縦横）
        textarea.addEventListener("input",function(e){
            let fs = parseFloat(window.getComputedStyle(textarea).fontSize);
            let maxLength = 0;
            for(let tmp of this.value.split("\n")){
                // 半角文字は約0.55倍、全角は1倍と仮定
                let len = 0;
                for (let c of tmp) {
                    len += (c.charCodeAt(0) <= 0xFF ? 0.55 : 1);
                }
                if (len > maxLength) maxLength = len;
            };
            this.style.width = fs * maxLength + "px";
            this.style.height = (this.value.split("\n").length + 1 ) * fs + "px";
        })
    }
    memoSheet_memo.appendChild(textarea);
    textarea.focus();
}

// 線を引く*****************************************************************
let drawing = false;
let sTop = 0;
let sLeft = 0;
let activeLine = null;
let snapRange = 50;

//========
// down
//========
memoSheet_memo.addEventListener("mousedown", function(e){
    if(keydown("Shift") || !lineMode) return;
    const line = createDOM("div");
    let pos = getPosition(e, memoSheet_memo);
    {
        line.style.position = "absolute";
        line.style.top = pos.y + "px";
        line.style.left = pos.x + "px";
        line.classList.add("line");
        mouseDrag(line);
        // ホバー
        line.addEventListener("mouseenter",function(e){
            if(keydown("Shift")) this.classList.add("soft-borer");
        })
        // ホバー終了
        line.addEventListener("mouseleave",function(e){
            this.classList.remove("soft-borer");
        })
    }
    drawing = true;
    sTop = pos.y;
    sLeft = pos.x;
    activeLine = line;
    memoSheet_memo.appendChild(line);
})
//========
// move
//========
memoSheet_memo.addEventListener("mousemove", function(e){
    if(drawing){

        // 追従******************************************
        // 縦横判断
        let pos = getPosition(e, memoSheet_memo);
        let widthLen = sLeft < pos.x ? pos.x - sLeft : sLeft - pos.x;
        let heightLen = sTop < pos.y ? pos.y - sTop : sTop - pos.y;
        // 4方向判定**
        let directions = {
            "RIGHT":widthLen > heightLen && sLeft < pos.x,
            "LEFT":widthLen > heightLen && sLeft > pos.x,
            "TOP":widthLen < heightLen && sTop < pos.y,
            "BOTTOM":widthLen < heightLen && sTop > pos.y,
        }
        if(widthLen > heightLen){
            // 横
            activeLine.style.height = "5px"
            activeLine.style.width = widthLen + "px"
            // 左方向にドラッグした場合は left を調整
            if(pos.x < sLeft){
                activeLine.style.left = pos.x + "px";
            }
        }else{
            // 縦
            activeLine.style.width = "5px"
            activeLine.style.height = heightLen + "px"
            // 下方向にドラッグした場合は top を調整
            if(pos.y < sTop){
                activeLine.style.top = pos.y + "px";
            }
        }
        
        // 面吸着******************************************
        let lines = Array.from(document.getElementsByClassName("line")).filter(el => el != activeLine);
        if(lines.length > 0){
            for(let el of lines){
                // element props
                let es = window.getComputedStyle(el);
                let elLeft   = parseFloat(es.left);
                let elTop    = parseFloat(es.top);
                let elWidth  = parseFloat(es.width);
                let elHeight = parseFloat(es.height);

                // 縦横判定
                let isVertical = elHeight > elWidth;
                // 横線　描画時
                if(directions.RIGHT || directions.LEFT){
                    // 近くの縦線に吸着
                    if(isVertical){
                        // 縦線の幅内に現在位置があるかどうか
                        if(pos.y > elTop && pos.y < elTop + elHeight){
                            if(Math.abs(pos.x-elLeft) < snapRange){
                                // →
                                if(directions.RIGHT) {
                                    if(elLeft < pos.x){
                                        // はみ出しあり
                                        activeLine.style.width = parseFloat(activeLine.style.width) - Math.abs(pos.x-elLeft) + "px";
                                    }else{
                                        // はみ出しなし
                                        activeLine.style.width = parseFloat(activeLine.style.width) + Math.abs(pos.x-elLeft) + "px";
                                    }
                                }
                                // ←
                                else {
                                    if(elLeft > pos.x){
                                        // はみ出しあり
                                        activeLine.style.width = parseFloat(activeLine.style.width) - Math.abs(pos.x-elLeft) + "px";
                                        activeLine.style.left = parseFloat(activeLine.style.left) + Math.abs(pos.x-elLeft) + "px";
                                    }else{
                                        // はみ出しなし
                                        activeLine.style.width = parseFloat(activeLine.style.width) + Math.abs(pos.x-elLeft) + "px";
                                        activeLine.style.left = parseFloat(activeLine.style.left) - Math.abs(pos.x-elLeft) + "px";
                                    }
                                }
                            }
                        }
                    }
                // 縦線　描画時
                }else if(directions.TOP || directions.BOTTOM){
                    // 近くの横線に吸着
                    if(!isVertical){
                        // 横線の幅内に現在位置があるかどうか
                        if(pos.x > elLeft && pos.x < elLeft + elWidth){
                            if(Math.abs(pos.y-elTop) < snapRange){
                                // ↑
                                if(directions.TOP) {
                                    if(elTop < pos.y){
                                        // はみ出しあり
                                        activeLine.style.height = parseFloat(activeLine.style.height) - Math.abs(pos.y-elTop) + "px";
                                    }else{
                                        // はみ出しなし
                                        activeLine.style.height = parseFloat(activeLine.style.height) + Math.abs(pos.y-elTop) + "px";
                                    }
                                }
                                // ↓
                                else {
                                    if(elTop > pos.y){
                                        // はみ出しあり
                                        activeLine.style.height = parseFloat(activeLine.style.height) - Math.abs(pos.y-elTop) + "px";
                                        activeLine.style.top = parseFloat(activeLine.style.top) + Math.abs(pos.y-elTop) + "px";
                                    }else{
                                        // はみ出しなし
                                        activeLine.style.height = parseFloat(activeLine.style.height) + Math.abs(pos.y-elTop) + "px";
                                        activeLine.style.top = parseFloat(activeLine.style.top) - Math.abs(pos.y-elTop) + "px";
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
})
//========
// up
//========
memoSheet_memo.addEventListener("mouseup", function(e){
    if(drawing){
        // 最低ライン****************************************************
        let pos = getPosition(e, memoSheet_memo);
        let widthLen = sLeft < pos.x ? pos.x - sLeft : sLeft - pos.x;
        let heightLen = sTop < pos.y ? pos.y - sTop : sTop - pos.y;
        // 4方向判定**
        let directions = {
            "RIGHT":widthLen > heightLen && sLeft < pos.x,
            "LEFT":widthLen > heightLen && sLeft > pos.x,
            "TOP":widthLen < heightLen && sTop < pos.y,
            "BOTTOM":widthLen < heightLen && sTop > pos.y,
        }
        if(directions.RIGHT || directions.LEFT){
            // 横
            if(parseFloat(activeLine.offsetWidth) < 30) {
                activeLine.remove();
                drawing = false;
                return;
            };
        }else{
            // 縦
            if(parseFloat(activeLine.offsetHeight) < 30) {
                activeLine.remove();
                drawing = false;
                return;
            };
        }

        // clone******************************************
        // let clone = activeLine.cloneNode(true);
        // {
        //     clone.style.cssText = activeLine.style.cssText;
        //     clone.style.top = sTop + parseFloat(window.getComputedStyle(activeLine).fontSize) * 2.5 + "px"; 
        //     mouseDrag(clone);
        // }
        // memoSheet_memo.appendChild(clone);
        // // 間にインプット挿入
        // setTimeout(() => {
        //     createInput_sheet(e, sTop + parseFloat(window.getComputedStyle(activeLine).fontSize) * 0.9 , sLeft)
        // }, 10);// ms

        drawing = false;
    }
})
// ******************************************************************************

// lineモードオンオフ
let lineMode = true;
function toggle_LineMode(){
    lineMode = !lineMode;
}
// 吸着範囲　変更
function change_snapRange(){
    let newVal = prompt("ライン同士の吸着範囲値を入力...（デフォルト：50）",snapRange)
    if(newVal != null && newVal){
        newVal = parseFloat(newVal);
        if(isNaN(newVal) || newVal < 0){
            alert("数値として認識できませんでした")
            return;
        }
        else snapRange = newVal;
        log(`吸着範囲を${snapRange}pxに変更しました`)
    }
}





// region ワーク-ツール管理 *******************************************************************************************************************************

// get dom
const exp_tool = getDOM("exp_tool");
const tree_tool = getDOM("tree_tool");
const working_div_tool = getDOM("working_div_tool");

function bootSys_WORK_TOOLMANAGER(isFirst){
    tree_tool.innerHTML = "";
    working_div_tool.innerHTML = `<label style="margin: 20px;">ツールが選択されていません...</label>`;
    if(isFirst){
        // イベント付与
        exp_tool.addEventListener("contextmenu",function(e){
            // 右クリックメニュー
            e.preventDefault();
            let orderArr = [
                {"printName":"新規作成", "icon":svg_spanner, "func":()=> createObj_tool(), },
            ];
            createMenu(orderArr);
        })
    }else{
        for(let obj of DATABASE.WORK[0].WORK_TOOLMANAGER){
            createObj_tool(obj);
        }
    }
}
// 作成 or 再構築
function createObj_tool(rebuildObj=null){
    let isRebuild = (rebuildObj != null);
    // new
    let objName = "";
    if(!isRebuild){
        let newName = prompt("新規ツール名を入力してください")
        if(newName!=null && newName.trim()) objName = newName;
        else return;
    }else{
        objName = rebuildObj["name"];
    }
    let li = createDOM("li");
    let icon = createDOM("span");
    let objId = getRandomString20(DATABASE.WORK[0].WORK_TOOLMANAGER);
    if(isRebuild) objId = rebuildObj["id"];
    li.textContent = objName;
    li.classList.add("folder");
    li.style.display = "flex";
    icon.style.marginRight = "5px";
    icon.innerHTML = svg_spanner_gray;
    icon.classList.add("iconButton");
    {
        // event
        li.addEventListener("contextmenu",function(e){
            // 右クリックメニュー
            e.preventDefault();
            e.stopPropagation();
            let orderArr = [
                {"printName":"リネーム", "icon":svg_edit, "func":() => rename_tool(objId, li), },
                {"printName":"削除", "icon":svg_gabage, "func":() => delete_tool(objId, li), },
            ];
            createMenu(orderArr);
        })
        li.addEventListener("click",function(e){
            // クリック
            e.preventDefault();
            e.stopPropagation();
            for(let tmp of tree_tool.children){
                if(tmp.classList.contains("bg-color-selection")) tmp.classList.remove("bg-color-selection");
            }
            this.classList.add("bg-color-selection")
            // 実行
            run_tool(objId);
        })
    }
    {
        // create data
        if(!isRebuild){
           let obj =  {"id":objId, "name":objName, "code":"", "memo":""};
           DATABASE.WORK[0].WORK_TOOLMANAGER.push(obj);
        }
    }
    li.prepend(icon);
    tree_tool.appendChild(li);
    if(!isRebuild) log("新規ツールが登録されました");
}
// delete
function delete_tool(objId, li){
    // data
    let obj = DATABASE.WORK[0].WORK_TOOLMANAGER.find(a=>a["id"]==objId);
    if(confirm(`[${obj["name"]}]を削除しますか？`)){
        DATABASE.WORK[0].WORK_TOOLMANAGER = DATABASE.WORK[0].WORK_TOOLMANAGER.filter(a => a["id"] != obj["id"]);
        li.remove();
        {
            // clear
            working_div_tool.innerHTML = "";
        }
    }
}
// rename
function rename_tool(objId, li){
    // data
    let newName = prompt("新しい名称を入力してください",li.textContent);
    if(newName && newName.trim()){
        DATABASE.WORK[0].WORK_TOOLMANAGER.find(a=>a["id"]==objId)["name"] = newName;
        const icon = createDOM("span");
        {
            icon.innerHTML = svg_spanner_gray;
            icon.classList.add("iconButton");
            icon.style.marginRight = "5px";
        }
        li.textContent = newName;
        li.prepend(icon);
    }
}
// ツールクリックイベント
function run_tool(objId){
    // フレームDOM洗い替え
    working_div_tool.innerHTML = "";
    let obj = DATABASE.WORK[0].WORK_TOOLMANAGER.find(a => a["id"] == objId);
    // タブ生成
    const workArea = createDOM("div");
    const tabContainer = createDOM("div");

    const button_run = createDOM("button");
    const button_edit = createDOM("button");
    const button_memo = createDOM("button");

    const icon_run = createDOM("span");
    const icon_edit = createDOM("span");
    const icon_memo = createDOM("span");
    {
        tabContainer.style.width = "100%";
        tabContainer.classList.add("tabs");
        button_run.classList.add("active");
        button_run.textContent = "Run";
        button_edit.textContent = "Edit";
        button_memo.textContent = "Memo";

        workArea.style.width = "62vw";
        workArea.style.height = "62vh";
        workArea.style.margin = "12px";

        icon_run.classList.add("iconButton");
        icon_edit.classList.add("iconButton");
        icon_memo.classList.add("iconButton");

        button_run.style.display = "flex";
        button_edit.style.display = "flex";
        button_memo.style.display = "flex";

        icon_run.style.marginRight = "5px";
        icon_edit.style.marginRight = "5px";
        icon_memo.style.marginRight = "5px";

        icon_run.innerHTML = svg_play_gray;
        icon_edit.innerHTML = svg_edit_gray;
        icon_memo.innerHTML = svg_memo_gray;

        button_run.prepend(icon_run);
        button_edit.prepend(icon_edit);
        button_memo.prepend(icon_memo);
    }
    // append
    tabContainer.appendChild(button_run);
    tabContainer.appendChild(button_edit);
    tabContainer.appendChild(button_memo);
    working_div_tool.appendChild(tabContainer);
    working_div_tool.appendChild(workArea);

    // 起動
    const frame = createDOM("iframe");
    {
        frame.style.width = "100%";
        frame.style.height = "100%";
        // 例外スロー（そもそも親に影響はないがログが荒れないよう）
        // let code = obj["code"].replaceAll(`<script>`,`<script> try{`)
        // code = code.replaceAll(`</script>`,`}catch(e){} </script>`)
        frame.srcdoc = obj["code"];
    }
    workArea.appendChild(frame);

    // 開け閉め
    function toggleTab(target){
        for(let tmp of tabContainer.children){
            if(tmp.classList.contains("active")) tmp.classList.remove("active");
        }
        target.classList.add("active");
        // clear
        workArea.innerHTML = "";
    }
    // イベントー起動
    button_run.addEventListener("click", function(e){
        toggleTab(this);
        // 再起動・洗い替え
        run_tool(objId);
    })
    // イベントー編集
    button_edit.addEventListener("click", function(e){
        toggleTab(this);
        const editor = createDOM("textarea");
        editor.classList.add("code-editor-area");
        workArea.appendChild(editor);
        {
            editor.value = obj["code"];
            editor.placeholder = "コードを入力...";
            editor.spellcheck = false; 
            editor.autoComplete = false; 
            // update code
            editor.addEventListener("change", function(e){
                DATABASE.WORK[0].WORK_TOOLMANAGER.find(a=>a["id"]==objId)["code"] = this.value;
            })
        }
    })
    // イベントー注釈
    button_memo.addEventListener("click", function(e){
        toggleTab(this);
        const memoArea = createDOM("textarea");
        memoArea.classList.add("code-editor-area");
        workArea.appendChild(memoArea);
        {
            memoArea.value = obj["memo"];
            memoArea.placeholder = "メモを入力...";
            memoArea.style.color = "black";
            memoArea.style.backgroundColor = "#fff";
            memoArea.style.border = "none";
            memoArea.spellcheck = false; 
            memoArea.autoComplete = false; 
            // update code
            memoArea.addEventListener("change", function(e){
                DATABASE.WORK[0].WORK_TOOLMANAGER.find(a=>a["id"]==objId)["memo"] = this.value;
            })
        }
    })
}




// region ワーク - フローチャート *******************************************************************************************************************************
// （１回しか通してはならないもの➤DOM取得、永続DOMのイベント設置）

const tree_createMode_flow = getDOM("tree_createMode_flow");
const toggle_tree_visible_flow = getDOM("toggle_tree_visible_flow");
const treeContainer_flow = getDOM("treeContainer_flow");
const tree_flow = getDOM("tree_flow");
const work_container_flow = getDOM("work_container_flow");
const flow_workArea = getDOM("flow_workArea");
const file_tab_container_flow = getDOM("file_tab_container_flow");
const title_flow = getDOM("title_flow");
const work_sheet_flow = getDOM("work_sheet_flow");
const modeInput = getDOM("modeInput");
toggle_tree_visible_flow.addEventListener("click", function(){
    treeContainer_flow.hidden = !treeContainer_flow.hidden;
    work_container_flow.style.width = treeContainer_flow.hidden ? "95%" : "68%";
})
tree_createMode_flow.addEventListener("change", function(){
    bootSys_WORK_FLOW(false);
})

function bootSys_WORK_FLOW(isFirst){

    // clear
    tree_flow.innerHTML = '';
    file_tab_container_flow.innerHTML = '';
    title_flow.value = "関連項目を選択";

    // build tree
    function build_tree(){
        // PG or TASK
        switch(tree_createMode_flow.value){
            case "PG":{
                // create **
                const container = tree_flow;

                // clone for work
                var cloneRepo_kaiso = DATABASE.MASTER[0].MASTER_PGCATEGORY;
                var cloneRepo_pginfo = DATABASE.MASTER[0].MASTER_PGINFO;

                // bool
                var count = cloneRepo_kaiso.find(a => a.hasOwnProperty("kaisoCount"))["kaisoCount"];

                // create kaiso folder
                for(let index = 1; index <= count; index++){
                    
                    let keyName = `kaiso${index}`;
                    for(let target of cloneRepo_kaiso.find(a => a.hasOwnProperty(keyName))[keyName]){

                        const containerElement = createDOM("div");
                        const button = createDOM("button");
                        const icon = createDOM("span");
                        containerElement.style.display = (index == 1 ? "block" : "none");
                        // props
                        {
                            containerElement.id = target["id"] + "_pgviewer_flow";
                            containerElement.style.marginLeft = "15px";
                            // if(index > 1) container.classList.add("pgviewer-kaisofolder-container");
                            containerElement.classList.add("pgviewer-kaisofolder-container");
                            button.textContent = target.name;
                            button.style.display = "flex";
                            button.style.userSelect = "none";
                            button.classList.add("pgviewer-kaisofolder");
                            button.style.backgroundColor = "#e8edf1ff";
                            button.style.color = "#61a6dfff";
                            button.style.borderLeft = "#80b0ccff solid 5px";
                            icon.innerHTML = svg_task_color2;
                            icon.style.marginRight = "10px";
                            icon.classList.add("iconButton")
                            // button.style.minWidth = (button.style.minWidth.replace("px", "") - 15 * (index-1)) + "px !important";
                            if(index==1) button.style.fontWeight = "bold";
                        }

                        // append
                        containerElement.appendChild(button);
                        button.prepend(icon);

                        // event listener
                        {
                            // toggle visible
                            button.addEventListener("click", function toggleChildrenVisible(){
                                for(let tmp of this.parentElement.children){
                                    if(tmp != this){
                                        let state = tmp.style.display == "block" ? "none" : "block"
                                        tmp.style.display=state;
                                    }
                                }
                            })
                        }
                        // append to tree or parentKaiso (id_pgviewer_flow)
                        const parentDOM = (index == 1 ? container : getDOM(target[`kaiso${index-1}ID`] + "_pgviewer_flow"));
                        parentDOM.appendChild(containerElement);
                    }
                }

                // create pg element
                for(let target of cloneRepo_pginfo){

                    const containerElement = createDOM("div");
                    const button = createDOM("button");
                    const remarkLabel = createDOM("label");
                    const remarkInput = createDOM("input");
                    const icon = createDOM("span");
                    // container.appendChild(remarkLabel);
                    // container.appendChild(remarkInput);
                    let parentIDList = null;
                    if(target["kaisoCSV"] != ""){
                        parentIDList = target["kaisoCSV"].split(",");
                    }

                    // props
                    {
                        containerElement.style.marginLeft = (parentIDList ? "25px" : "15px");
                        containerElement.style.display = "flex";
                        containerElement.style.display = "none";
                        button.textContent = target.name;
                        button.style.display = "flex";
                        button.style.userSelect = "none";
                        button.classList.add("pgviewer-pgelement");
                        button.style.backgroundColor = "#e8edf1ff";
                        button.style.color = "#61a6dfff";
                        remarkLabel.textContent = "備考：";
                        remarkInput.placeholder = "メモを入力…";
                        remarkInput.value = target["remark"];
                        remarkInput.style.marginLeft = "10px";
                        remarkInput.style.border = "none";
                        remarkInput.style.color = "gray";
                        remarkInput.style.borderBottom = "solid gray 1px";
                        icon.innerHTML = svg_edit_color2;
                        icon.style.marginRight = "10px";
                        icon.classList.add("iconButton")
                    }

                    button.prepend(icon);
                    containerElement.appendChild(button);
                    const targetID = target["ID"];

                    // event listener
                    {
                        // click
                        button.addEventListener("click", function (){
                            // title
                            title_flow.value = target.name;
                            // tree-obj-style
                            for(let tmp of document.getElementsByClassName("selected-tree-obj-flow")){
                                tmp.classList.remove("selected-tree-obj-flow");
                            }
                            this.classList.add("selected-tree-obj-flow");
                            // create-file-tab
                            openFile("PG", targetID)
                        })
                    }
                    // append
                    try{
                        (!parentIDList ? container : getDOM(parentIDList[parentIDList.length-1] + "_pgviewer_flow")).appendChild(containerElement);
                    }catch(e){
                        log(`[${target["pgid"]}:${target["name"]}] は所属階層が削除済みのため、ビューアーに生成されませんでした`);
                    }
                }

                break;
            }
            case "TASK":{
                // create **
                const container = tree_flow;
                // clone for work
                var cloneRepo = DATABASE.WORK[0].WORK_TASK;
                // prev
                var prevDate = "";
                // create date folder
                for(let target of cloneRepo){
                    let targetDate = target["addedDate"];
                    // skip
                    if(targetDate==prevDate || getDOM(targetDate + "_pgviewer_flow")){
                        continue;
                    }
                    prevDate = targetDate;
                    // create
                    const containerElement = createDOM("div");
                    const button = createDOM("button");
                    const icon = createDOM("span");
                    // props
                    {
                        containerElement.id = targetDate + "_pgviewer_flow";
                        containerElement.style.marginLeft = "15px";
                        containerElement.classList.add("pgviewer-kaisofolder-container");
                        button.textContent = targetDate;
                        button.style.display = "flex";
                        button.style.userSelect = "none";
                        button.classList.add("pgviewer-kaisofolder");
                        button.style.backgroundColor = "#e8edf1ff";
                        button.style.color = "#61a6dfff";
                        button.style.borderLeft = "#80b0ccff solid 5px";
                        icon.innerHTML = svg_task_color2;
                        icon.style.marginRight = "10px";
                        icon.classList.add("iconButton")
                    }
                    // append
                    containerElement.appendChild(button);
                    button.prepend(icon);
                    // event listener
                    {
                        // toggle visible
                        button.addEventListener("click", function toggleChildrenVisible(){
                            for(let tmp of this.parentElement.children){
                                if(tmp != this){
                                    let state = tmp.style.display == "block" ? "none" : "block"
                                    tmp.style.display=state;
                                }
                            }
                        })
                    }
                    // append to tree or parentKaiso (id_pgviewer_flow)
                    container.appendChild(containerElement);
                }
                // create task element
                for(let target of cloneRepo){
                    let targetDate = target["addedDate"];
                    const containerElement = createDOM("div");
                    const button = createDOM("button");
                    const icon = createDOM("span");
                    // props
                    {
                        containerElement.style.marginLeft = "25px";
                        containerElement.style.display = "flex";
                        containerElement.style.display = "none";
                        button.textContent = `【${targetDate}】`
                                            + `\n${target["pgInfo"] ? target["pgInfo"] : "ー"}`
                                            + `\n ${target["content"] ? target["content"] : "ー"}`;
                        button.style.display = "flex";
                        button.style.userSelect = "none";
                        button.classList.add("pgviewer-pgelement");
                        button.style.backgroundColor = "#e8edf1ff";
                        button.style.color = "#61a6dfff";
                        icon.innerHTML = svg_edit_color2;
                        icon.style.marginRight = "10px";
                        icon.classList.add("iconButton")
                    }
                    button.prepend(icon);
                    containerElement.appendChild(button);
                    const targetID = target["ID"];
                    // event listener
                    {
                        // click
                        button.addEventListener("click", function (){
                            // title
                            title_flow.value = button.textContent;
                            // style
                            for(let tmp of document.getElementsByClassName("selected-tree-obj-flow")){
                                tmp.classList.remove("selected-tree-obj-flow");
                            }
                            this.classList.add("selected-tree-obj-flow");
                            // create-file-tab
                            openFile("PG", targetID)
                        })
                    }
                    // append
                    try{
                        getDOM(targetDate + "_pgviewer_flow").appendChild(containerElement);
                    }catch(e){
                        log(`タスクビュー生成に失敗しました`);
                    }
                }
                break;
            }
        }
    }
    build_tree();

    // ファイルクリック（PG or TASK、PGObjID or TASKObjID）
    function openFile(type, objID){
        // create tab
        file_tab_container_flow.innerHTML = '';
        const newButton = createDOM("button");
        {
            newButton.textContent = "新規作成";
            newButton.id = "new_button_tab_flow";
            newButton.style.backgroundColor = "#ffff";
            newButton.classList.add("tab-button-flow");
            // newButton.classList.add("active");
        }
        file_tab_container_flow.appendChild(newButton);
    }

    // mode val
    let modeObj = "";
    // menuDOM（コンテナ格納➤参照操作用　参照操作後はnullで初期化）
    let menuDOM = null;
    // menu data
    let menuJson_new_flow = [
        {
            "printName":"テキストカード",
            "modeName":"textarea",
            "icon":svg_card2,
            "className":"sheetElement_flow,like-card-white",// 共通判別用クラス + CSV
            "childMenu":null,
        },
        {
            "printName":"図形...",
            "modeName":"shapes",
            "icon":svg_shapes2,
            "childMenu":
            [
                {
                    "path":"図形>",
                    "printName":"スクエア",
                    "modeName":"square",
                    "icon":svg_square2,
                    "className":"sheetElement_flow",
                    "childMenu":null
                },
                {
                    "path":"図形>",
                    "printName":"サークル",
                    "modeName":"circle",
                    "icon":svg_circle2,
                    "className":"sheetElement_flow",
                    "childMenu":null
                },
            ],
        },
    ];

    // editor function
    if(isFirst){
        // keyDown
        work_sheet_flow.addEventListener("keydown", function(e){
            if(e.key===" "){
                // space for createMenu
                e.preventDefault();
                if(!menuDOM){
                    createEditMenu();
                }else{
                    // move focus
                    let cnt = 0;
                    let index = null;
                    for(let target of menuDOM.children){
                        if(document.activeElement==target){
                            index = cnt;
                            break;
                        }
                        cnt++;
                    }
                    if(index!=null && menuDOM.children.length > index+1){ // 0はfalse値
                        menuDOM.children[index+1].focus();
                    }else{
                        menuDOM.children[0].focus();
                    }
                }
            }else if(e.key==="Escape"){
                // remove menu
                e.preventDefault();
                removeMenu();
            }else if(e.key==="ArrowUp" || e.key==="ArrowDown" || e.key==="ArrowLeft" || e.key==="ArrowRight"){
                // 選択
                let arr = document.getElementsByClassName("sheetElement_flow");
                if(arr){
                    let currentSelection = document.getElementsByClassName("selected_sheetElement_flow");
                    if(currentSelection){
                        // 既選択あり
                    }else{
                        // 既選択ナシ
                    }
                }
            }
        })
        // click
        work_sheet_flow.addEventListener("click", function(e){
            // remove menu
            removeMenu();

        })
        // active
        work_sheet_flow.addEventListener("focus", function(e){
            title_flow.style.color = "#61a6dfff";
        })
        // not active
        work_sheet_flow.addEventListener("blur", function(e){
            title_flow.style.color = "#a7b2bbff";
        })
    }

    // functions**
    
    // remove menu*
    function removeMenu(){
        if(menuDOM){
            menuDOM.remove();
            menuDOM = null;
        }
        active()
    }
    // フォーカス
    function active(){
        work_sheet_flow.focus();
    }
    // 選択
    function select(target){
        let arr = document.getElementsByClassName("selected_sheetElement_flow");
        if(arr){
            arr[0].classList.remove("selected_sheetElement_flow");
        }
        target.classList.add("selected_sheetElement_flow");
    }
    // jsonデータをもとに編集メニュー作成、クリックでモード変数を更新*
    function createEditMenu(repo = menuJson_new_flow){
        const container = createDOM("div");
        const pathLabel = createDOM("label");
        menuDOM = container;
        if(repo.find(a => a.hasOwnProperty("path"))){
            pathLabel.textContent = repo[0]["path"];
            {
                pathLabel.tabIndex = 0;
                pathLabel.style.color = "#61a6dfff";
                // pathLabel.style.backgroundColor = "#fafafaff";
                pathLabel.style.fontSize = "15px";
                pathLabel.style.marginBottom = "5px";
                pathLabel.addEventListener("focus", function(){
                    // パスラベル　フォーカススキップ
                    try{
                        this.parentElement.children[1].focus();
                    }catch(e){}
                })

            }
            // container.appendChild(pathLabel);
        }
        for(let target of repo){
            const button = createDOM("button");
            const icon = createDOM("span");
            {
                button.classList.add("pgviewer-pgelement");
                button.textContent = target["printName"];
                button.style.display = "flex";
                button.style.outline = "none";
                if(target["icon"]) icon.innerHTML = target["icon"];
                icon.style.marginRight = "10px";
                icon.classList.add("iconButton")
                button.style.backgroundColor = "#f1f5f7ff";
                button.style.color = "#61a6dfff";
                button.style.borderLeft = "5px solid #61a6dfff";
                container.style.position = "absolute";
                container.style.marginTop = "5px";
                container.style.marginLeft = "5px";
                const childArray = target["childMenu"];
                // event
                button.addEventListener("click", function(e){
                    // child menu
                    e.stopPropagation();
                    if(childArray){
                        removeMenu();
                        createEditMenu(childArray);
                    }else{
                        modeObj = target;
                        removeMenu();
                        startEdit();
                    }
                })
                button.addEventListener("focus", function(){
                    // style
                    this.classList.add("focusedMenu");
                })
                button.addEventListener("blur", function(){
                    // style
                    this.classList.remove("focusedMenu");
                })
            }
            if(target["icon"]) button.prepend(icon);
            container.appendChild(button);
        }
        work_sheet_flow.appendChild(container);
        try{ menuDOM.children[0].focus(); }catch(e){};
    }

    // モード別編集実行（ by modeObj）
    function startEdit(){
        // 共通
        modeInput.value = `${(modeObj.hasOwnProperty("path") ? modeObj["path"] : "") + modeObj["printName"]}`;
        function addClass(target){
            // データで指定されたクラスをすべて付与
            for(let className of modeObj["className"].split(',')){
                target.classList.add(className);
            }
        }
        
        // 分岐
        switch(modeObj["modeName"]){
            // テキストカード
            case "textarea":{
                const textarea = createDOM("textarea");
                {
                    addClass(textarea);
                    textarea.style.position = "absolute";
                    textarea.style.resize = "both";
                    textarea.spellcheck = false;
                    textarea.autoComplete = false;
                }
                textarea.addEventListener("click",function(e){
                    // 伝播防止
                    e.stopPropagation();
                })
                textarea.addEventListener("keydown",function(e){
                    // 伝播防止（スペースメニュー）
                    e.stopPropagation();
                    if(e.key==="Escape"){
                        // escapeでフォーカス外し
                        active();
                    }
                })
                work_sheet_flow.appendChild(textarea);
                textarea.focus();
                break;
            }
        }
    }
}



// #region 共通関数（大） ******************************************************************* /






// #region PG階層 配列にてselect返却（階層を指定）※例，function (3) → [null, select1, select2, select3]
function createDOM_kaisoSelect(kaisoNo){

    let paramKaisoNo = kaisoNo

    let arrayResult = [null];

    // clone for work
    var cloneRepo = DATABASE.MASTER[0].MASTER_PGCATEGORY;

    for(let index = 1; index <= paramKaisoNo; index++){
        
        create();

        function create(){
            // create
            const select = createDOM("select");
            const emptyOption = createDOM("option")
            emptyOption.textContent=`所属階層${index}を選択...`
            emptyOption.value="";
            select.appendChild(emptyOption)
            select.classList.add("medium-input");
            select.style.color="gray";

            // option
            for(let target of cloneRepo.find(a => a.hasOwnProperty(`kaiso${index}`))[`kaiso${index}`]){

                if(index == 1 || target[`kaisoi${index-1}ID`] == arrayResult[index-1].value){
                    const option = createDOM("option");
                    option.value = target.id;
                    option.textContent = target.name;
                    select.appendChild(option);
                }
            }

            // change
            select.addEventListener("change", function(e){
                // 従属階層をリセット
                for(let i = index + 1; i <= paramKaisoNo; i++){
                    let childSelect = arrayResult[i];
                    if(childSelect){
                        childSelect.value = ""; // 選択解除
                        // optionもリセット（空オプションだけ残す）
                        while(childSelect.options.length > 1){
                            childSelect.remove(1);
                        }
                        // option
                        for(let target of cloneRepo.find(a => a.hasOwnProperty(`kaiso${i}`))[`kaiso${i}`].filter(b => b[`kaiso${i-1}ID`] == arrayResult[i-1].value)){
                            const option = createDOM("option");
                            option.value = target.id;
                            option.textContent = target.name;
                            childSelect.appendChild(option);
                        } 
                    }
                }
            });

            arrayResult.push(select);
        }
    }

    return arrayResult;

}

// #region PG情報参照（ビューアー参照、指定DOMに代入）
// ※textContent or value　例，階層1>階層2>PG名 [pgid], afterFunc：代入後に実行したい関数
function bootSub_refViewer(targetDOM, hiddenIDInput = null, afterFunc = null){
    // create **
    const modal = createDOM("div");
    const subWindow = createDOM("div");
    const container = createDOM("div");
    const title = createDOM("h1");

    // prop
    modal.style.zIndex = 100;
    subWindow.style.zIndex = 120;
    container.style.zIndex = 120;
    modal.classList.add("modal");
    subWindow.classList.add("like-card-white");
    {
        subWindow.style.position="absolute";
        subWindow.style.top = "5vh";
        subWindow.style.left = "30vw";
        subWindow.style.height = "85vh";
        subWindow.style.maxHeight = "85vh";
        subWindow.style.width = "40vw";
        container.style.maxHeight = "90%";
        container.style.overflowY = "auto";
    }
    title.textContent = "ビューアー参照";
    title.classList.add("page-title")

    // append
    subWindow.appendChild(title);
    subWindow.appendChild(container);
    document.body.appendChild(modal);
    document.body.appendChild(subWindow);

    // event
    modal.addEventListener("click", function(e){
        end();
    })

    // end
    function end(){
        subWindow.remove();
        modal.remove();
    }

    // clone for work
    var cloneRepo_kaiso = DATABASE.MASTER[0].MASTER_PGCATEGORY;
    var cloneRepo_pginfo = DATABASE.MASTER[0].MASTER_PGINFO;

    // bool
    var maxKaiso = cloneRepo_kaiso.find(a => a.hasOwnProperty("kaisoCount"))["kaisoCount"];

    // create kaiso folder
    for(let index = 1; index <= maxKaiso; index++){
        
        let keyName = `kaiso${index}`;
        for(let target of cloneRepo_kaiso.find(a => a.hasOwnProperty(keyName))[keyName]){

            const containerElement = createDOM("div");
            const button = createDOM("button");
            const icon = createDOM("span");
            containerElement.style.display = (index == 1 ? "block" : "none");
            // props
            {
                containerElement.id = target["id"] + "_pgviewer_ref";
                containerElement.style.marginLeft = "15px";
                // if(index > 1) container.classList.add("pgviewer-kaisofolder-container");
                containerElement.classList.add("pgviewer-kaisofolder-container");
                button.textContent = target.name;
                button.style.display = "flex";
                button.style.userSelect = "none";
                button.classList.add("pgviewer-kaisofolder");
                icon.innerHTML = svg_task;
                icon.style.marginRight = "10px";
                icon.classList.add("iconButton")
                // button.style.minWidth = (button.style.minWidth.replace("px", "") - 15 * (index-1)) + "px !important";
                if(index==1) button.style.fontWeight = "bold";
            }

            // append
            containerElement.appendChild(button);
            button.prepend(icon);

            // event listener
            {
                // toggle visible
                button.addEventListener("click", function toggleChildrenVisible(){
                    for(let tmp of this.parentElement.children){
                        if(tmp != this){
                            let state = tmp.style.display == "block" ? "none" : "block"
                            tmp.style.display=state;
                        }
                    }
                })
            }
            // append to tree or parentKaiso (id_pgviewer_ref)
            const parentDOM = (index == 1 ? container : getDOM(target[`kaiso${index-1}ID`] + "_pgviewer_ref"));
            parentDOM.appendChild(containerElement);
        }
    }

    // create pg element
    for(let target of cloneRepo_pginfo){

        const containerElement = createDOM("div");
        const button = createDOM("button");
        const remarkLabel = createDOM("label");
        const remarkInput = createDOM("input");
        const icon = createDOM("span");
        // container.appendChild(remarkLabel);
        // container.appendChild(remarkInput);
        let parentIDList = null;
        if(target["kaisoCSV"] != ""){
            parentIDList = target["kaisoCSV"].split(",");
        }

        // props
        {
            containerElement.style.marginLeft = (parentIDList ? "25px" : "15px");
            containerElement.style.display = "flex";
            containerElement.style.display = "none";
            button.textContent = target.name;
            button.style.display = "flex";
            button.style.userSelect = "none";
            button.classList.add("pgviewer-pgelement");
            remarkLabel.textContent = "備考：";
            remarkInput.placeholder = "メモを入力…";
            remarkInput.value = target["remark"];
            remarkInput.style.marginLeft = "10px";
            remarkInput.style.border = "none";
            remarkInput.style.color = "gray";
            remarkInput.style.borderBottom = "solid gray 1px";
            icon.innerHTML = svg_edit;
            icon.style.marginRight = "10px";
            icon.classList.add("iconButton")
        }

        button.prepend(icon);
        containerElement.appendChild(button);

        // event listener
        {
            // set info
            button.addEventListener("click", function (){
                // create value text
                let tmp = "";
                for(let i = 0; i < parentIDList.length; i++){
                    let obj = cloneRepo_kaiso.find(a => a.hasOwnProperty(`kaiso${i + 1}`))[`kaiso${i + 1}`].find(b => b.id==parentIDList[i]);
                    if(obj){
                        tmp += `${obj["name"]}> `;
                    }
                }
                tmp += `${target["name"]} [${target["pgid"]}]`;
                // set
                try{ 
                    targetDOM.value = tmp;
                }catch(e){
                    try{ targetDOM.textContent = tmp; }catch(e){}
                }
                // hidden id
                if(hiddenIDInput) hiddenIDInput.value = target["id"];
                // after function
                if(afterFunc!=null) afterFunc();
                // end
                end();
            })
        }
        // append
        try{
            (!parentIDList ? container : getDOM(parentIDList[parentIDList.length-1] + "_pgviewer_ref")).appendChild(containerElement);
        }catch(e){
            log(`[${target["pgid"]}:${target["name"]}] は所属階層が削除済みのため、ビューアーに生成されませんでした`);
        }
    }
}


// #region サブ：タスクメモ（param：タスクID）
function bootSub_taskMemos(taskObjID, miniMode = false){

    // CONFIG
    let CONFIG = {
        // SUB WINDOW
        "SUBWINDOW_WIDTH": "80vw",
        "SUBWINDOW_MAXWIDTH": "80vw",
        "SUBWINDOW_HEIGHT": "85vh",
        "SUBWINDOW_MAXHEIGHT": "85vh",
        // ROW CNT
        "ROWCNT": "3",
        // POSITION
        "LEFT": "10vw",
    }

    // 簡易モード用
    if(miniMode){
        CONFIG = {
            // SUB WINDOW
            "SUBWINDOW_WIDTH": "29vw",
            "SUBWINDOW_MAXWIDTH": "29vw",
            "SUBWINDOW_HEIGHT": "85vh",
            "SUBWINDOW_MAXHEIGHT": "85vh",
            // ROW CNT
            "ROWCNT": "1",
            // POSITION
            "LEFT": "15vw",
        }
    }

    // RESET
    if(getDOM("bootSub_taskMemos_SubWindow")) getDOM("bootSub_taskMemos_SubWindow").remove();

    // clone for work
    var cloneRepo = DATABASE.WORK[0].WORK_TASK;

    // create **
    const modal = createDOM("div");
    const subWindow = createDOM("div");
    const container = createDOM("div");
    const title = createDOM("input");
    const path = createDOM("h1");
    const sheetAddButton = createDOM("button");
    const closeButton = createDOM("span");

    // prop
    modal.style.zIndex = 100;
    subWindow.id = "bootSub_taskMemos_SubWindow";
    subWindow.style.zIndex = 120;
    container.style.zIndex = 120;
    modal.classList.add("modal");
    title.type = "text";
    title.readOnly = true;
    title.style.border = "none";
    title.style.backgroundColor = "transparent";
    title.style.fontWeight = "bold";
    title.style.width = "80%";
    title.style.color = "black";
    path.style.color = "#777777ff";
    title.style.fontSize = "16px";
    path.style.fontSize = "12px";
    sheetAddButton.textContent = "３枚追加";
    sheetAddButton.classList.add("mini-btn");
    sheetAddButton.style.position = "absolute";
    sheetAddButton.style.right = "3%";
    sheetAddButton.style.bottom = "0.7%";
    sheetAddButton.style.fontSize = "12px";
    subWindow.classList.add("like-card-white");
    closeButton.style.position = "absolute";
    closeButton.innerHTML = svg_close_gray;
    closeButton.style.cursor = "pointer";
    closeButton.style.top = "2%";
    closeButton.style.right = "2%";
    {
        subWindow.style.position="absolute";
        subWindow.style.border="1px gray solid";
        subWindow.style.boxShadow="0 4px 6px -4px rgba(0, 0, 0, 0.3)";
        subWindow.style.top = "5vh";
        subWindow.style.left = CONFIG.LEFT;
        subWindow.style.height = CONFIG.SUBWINDOW_HEIGHT;
        subWindow.style.maxHeight = CONFIG.SUBWINDOW_MAXHEIGHT;
        subWindow.style.width = CONFIG.SUBWINDOW_WIDTH;
        container.style.maxHeight = "90%";
        container.style.overflowY = "auto";
        container.style.backgroundColor = "#f4f6f8";
        subWindow.style.backgroundColor = "#f4f6f8";
        sheetAddButton.addEventListener("click", function(){
            // メモ追加・再構築
            pushJSON_emptyMemos(3);
            resetView();
            log("作業メモを３枚追加しました");
            end();
            bootSub_taskMemos(taskObjID);
        })
    }
    title.value = `${cloneRepo.find(a => a.id == taskObjID)["content"] ? cloneRepo.find(a => a.id == taskObjID)["content"] : ""}`;
    path.textContent = `${cloneRepo.find(a => a.id == taskObjID)["pgInfo"] ? cloneRepo.find(a => a.id == taskObjID)["pgInfo"] : ""}`;
    title.classList.add("page-title")

    // append
    subWindow.appendChild(title);
    subWindow.appendChild(path);
    if(!miniMode)subWindow.appendChild(sheetAddButton);
    subWindow.appendChild(closeButton);
    subWindow.appendChild(container);
    // 簡易モードならフリーに動かせる仕様
    if(!miniMode) document.body.appendChild(modal);
    document.body.appendChild(subWindow);

    // event
    modal.addEventListener("click", function(e){
        end();
    })

    // close
    closeButton.addEventListener("click", function(e){
        end();
    })

    // end
    function end(){
        subWindow.remove();
        modal.remove();
    }

    // データを基にメモ画面再構築
    function resetView(){
        const table = createDOM("table");
        const thead = createDOM("thead");
        const tbody = createDOM("tbody");
        table.style.width = "90%";
        table.style.height = "90%";
        {
            // ２列
            const theadTr = createDOM("tr");
            const thTmp = createDOM("th");
            const thTmp2 = createDOM("th");
            theadTr.appendChild(thTmp);
            theadTr.appendChild(thTmp2);
        }
        let index = 1;
        let tr;
        for(let target of cloneRepo.find(a => a.id == taskObjID)["memos"]){
            // td
            // if(index%2 == 1){
            let rowCnt = parseInt(CONFIG.ROWCNT);
            // 一列
            if(rowCnt == 1){
                tr = createDOM("tr")
                tbody.appendChild(tr);
            // 複数列
            }else{
                if(index % 3 == 1){
                    tr = createDOM("tr")
                    tbody.appendChild(tr);
                }
            }
            const td = createDOM("td");
            const div_input = createDOM("div");
            const input = createDOM("input");
            const div_textarea = createDOM("div");
            const textarea = createDOM("textarea");
            {
                // props
                input.type = "text";
                input.value = target.title;
                input.style.border = "1px solid #ccc";
                input.style.padding = "6px";
                input.style.border = "none";
                input.style.borderRadius = "4px";
                input.style.border = "1px #d6d6d6ff solid";
                input.style.borderLeft = "4px solid #4090ff";
                input.style.backgroundColor = " #fff";
                input.placeholder = "タイトル...";
                input.style.margin = "3px";
                textarea.value = target.memoText;
                textarea.style.border = "1px #d6d6d6ff solid";
                textarea.spellcheck = "off";
                textarea.style.width = "24vw";
                textarea.style.height = "30vh";
                textarea.spellcheck = false;
                // textarea.style.resize = "vertical";
                textarea.style.resize = "none";
                // textarea.classList.add("like-card-white");
                textarea.classList.add("pg-memo-body");

                // event
                input.addEventListener("change", function(){
                    target.title = this.value;
                })
                textarea.addEventListener("change", function(){
                    target.memoText = this.value;
                })
            }
            div_input.appendChild(input);
            div_textarea.appendChild(textarea);
            td.appendChild(div_input);
            td.appendChild(div_textarea);
            tr.appendChild(td);
            index++;
        }
        table.appendChild(thead);
        table.appendChild(tbody);
        container.appendChild(table);
    }

    // 新規メモデータ作成**
    function pushJSON_emptyMemos(count){
        let sheetCnt = (cloneRepo.find(a => a.id == taskObjID)["memos"].length + 1);
        for(let i = sheetCnt; i <= sheetCnt + count - 1; i++){
            // get unique ID
            var let = false;
            var uniqueID = getRandomString20();
            while(!let){
                let = true;
                if(cloneRepo.find(a => a.id == taskObjID)["memos"].some(b => b.id == uniqueID) ){
                    let = false;
                    uniqueID = getRandomString20();
                }
                if(let) break;
            }
            let obj = {"id": uniqueID, "title": `Title${i}`, "memoText": ""};
            cloneRepo.find(a => a.id == taskObjID)["memos"].push(obj);
        }
    }

    // 初起動時に４つのメモオブジェクトを作成
    if(cloneRepo.find(a => a.id == taskObjID)["memos"].length == 0){
        pushJSON_emptyMemos(12);
    }

    // 再構築
    resetView();

}


// region 作業カテゴリセレクト作成　※select返却
function createDOM_workCategory(){
    const select = createDOM("select");
    const emptyOption = createDOM("option");
    {
        emptyOption.value = "";
        emptyOption.textContent = "作業カテゴリを選択...";
    }
    select.appendChild(emptyOption);
    for(let obj of DATABASE.MASTER[0].MASTER_WORKCATEGORY){
        const option = createDOM("option");
        option.value = obj.id;
        option.textContent = obj.name;
        select.appendChild(option);
    }
    return select;
}



// region メニュー作成
// 例、{"printName":"フォルダを作成", "icon":null, "func":null},を配列形式で
function createMenu(orderArr){
    if(getDOM("unique_container_context")){
        getDOM("unique_container_context").remove();
    }
    const container = createDOM("div");
    {
        container.id = "unique_container_context";
        container.style.position = "absolute";
        container.style.top = mouseY + "px";
        container.style.left = mouseX + "px";
    }
    for(let obj of orderArr){
        const button = createDOM("button")
        const icon = createDOM("span");
        {
            button.textContent = obj["printName"];
            button.classList.add("contextitem");
            button.style.display = "flex";
            button.style.margin = "0.1";
            icon.classList.add("iconButton");
            icon.style.marginRight = "5px";
            if(obj["icon"]) icon.innerHTML = obj["icon"];
            if(obj["func"]){
                button.addEventListener("click", function(e){
                    e.stopPropagation();
                    container.remove();
                    obj["func"]();
                })
            }
        }
        button.prepend(icon);
        container.appendChild(button);
    }
    document.body.appendChild(container);
    // クリックで削除（ドキュメントへのイベント重複登録を防ぐ）
    document.addEventListener("click", function (){
        container.remove();
    },{once:true});
}


// =================================================================
// region ボックスに検索機能を付与
// 機能１：全階層・PG情報のあいまい検索機能
// 機能２：クリック時に指定した関数を実行
// 機能３：クリック対象の情報をhiddenに格納
// 結果　："KAISO,KaisoIndex,KaisoObjId"
// 結果　："PG,PGObjID"
// 注意　：ボックスの親DIVにappendするためコンテナ必須
// =================================================================
function attachSearchHandler(targetBox, resHidden, afterFunc){

    // RESULT CONTAINER
    const boxStyle = targetBox.getBoundingClientRect();
    const resultContainer = createDOM("div");
    {
        resultContainer.classList.add("explorer-search-result");
        resultContainer.style.width = boxStyle.width;
    }

    // 親へappend
    targetBox.parentElement.appendChild(resultContainer);

    // ADD EVENT
    targetBox.addEventListener("input", function(e) {attachEvent()})
    targetBox.addEventListener("focus", function(e) {attachEvent()})
    targetBox.addEventListener("click", function(e) {e.stopPropagation()}) // documentへのクリック伝播防止
    document.addEventListener("click", function(e) { 
        resultContainer.innerHTML = ""; 
    })
    targetBox.addEventListener("keydown", function(e) { 
        if(e.key === "Escape"){
            e.preventDefault();
            resultContainer.innerHTML = "";
        }
    })

    // FUNCTION
    function attachEvent(){

        resultContainer.innerHTML = "";

        // RETURN
        if(!targetBox.value.trim()) return;

        // MAX KAISO
        let maxKaiso = DATABASE.MASTER[0].MASTER_PGCATEGORY.find(a => a.hasOwnProperty("kaisoCount")).kaisoCount;
        let val = targetBox.value.trim().toLowerCase();

        // -------------
        // 階層検索
        // -------------
        for(let kaisoIndex = 1; kaisoIndex <= maxKaiso; kaisoIndex++){

            // KAISO{index}
            let keyName = `kaiso${kaisoIndex}`;
            let kaisoRepo = DATABASE.MASTER[0].MASTER_PGCATEGORY.find(a => a[keyName])[keyName]

            for(let kaisoObj of kaisoRepo){

                // パス名称
                let pathName = kaisoObjToPath(kaisoObj, kaisoIndex);

                // 比較対象
                let compareString = kaisoObj["name"].toLowerCase() + "," + pathName;

                if(!compareString.includes(val)) continue;

                let kaisoButton = createDOM("button");

                kaisoButton.classList.add("explorer-search-item");

                // ハイライト
                let tmpIdx = 1;

                for(let objName of compareString.split(",")){

                    let MODE = {"NAME":tmpIdx==1, "PATH":tmpIdx==2}

                    let startIdx = objName.toLowerCase().indexOf(val);
                    let len = val.length;

                    let SSpan = createDOM("span");
                    let CSpan = createDOM("span");
                    let ESpan = createDOM("span");

                    CSpan.style.backgroundColor = "#0077ffff"
                    CSpan.style.color = "#ffff"

                    // PATH STYLE
                    if(MODE.PATH){
                        SSpan.style.color = "#999999ff";
                        ESpan.style.color = "#999999ff";
                        SSpan.style.marginLeft = "20px";
                    }

                    // HIT
                    if(startIdx != -1){
                    SSpan.innerHTML = objName.substring(0, startIdx);
                    CSpan.innerHTML = objName.substring(startIdx, startIdx+len);
                    ESpan.innerHTML = objName.substring(startIdx+len);
                    
                    // NO HIT
                    }else{
                        SSpan.innerHTML = objName;
                    }

                    kaisoButton.appendChild(SSpan);
                    kaisoButton.appendChild(CSpan);
                    kaisoButton.appendChild(ESpan);

                    tmpIdx++;
                }

                let id = kaisoObj["id"] + "_search";
                kaisoButton.id = id;

                // //PATH
                // let path = createDOM("span");
                // path.innerHTML = kaisoObjToPath(kaisoObj, kaisoIndex);
                // path.style.marginLeft = "20px";
                // path.style.color = "#999999ff";
                // kaisoButton.appendChild(path);

                // ADD EVENT
                kaisoButton.addEventListener("click",function(e){
                    if(resHidden) resHidden.value = "KAISO" + "," + kaisoIndex + "," + kaisoObj["id"];
                    if(afterFunc) afterFunc();
                    resultContainer.innerHTML = "";
                })

                // ICON
                const icon = createDOM("span");
                icon.innerHTML = `階層${kaisoIndex}`;
                icon.style.marginRight = "5px";
                icon.style.marginLeft = "5px";
                icon.style.color = "#eb8b31ff";
                // icon.style.fontWeight = "bold";
                kaisoButton.prepend(icon);

                // APPEND（重複回避）
                if(!getDOM(id)) resultContainer.appendChild(kaisoButton);

            }
        }

        // -------------
        // PG検索
        // -------------
        for(let pgObj of DATABASE.MASTER[0].MASTER_PGINFO){

            // パス名称
            let pathName = kaisoCSVToPath(pgObj["kaisoCSV"]);

            let idName = pgObj["name"] + "," +pgObj["pgid"].toLowerCase() + "," + pathName;

            if(!idName.includes(val)) continue;

            let pgButton = createDOM("button");

            // STYLE
            pgButton.classList.add("explorer-search-item");

            // ハイライト
            let tmpIdx = 1;

            for(let objName of [pgObj["name"], pgObj["pgid"], pathName]){

                let MODE = {"NAME":tmpIdx==1, "ID":tmpIdx==2, "PATH":tmpIdx==3}

                let startIdx = objName.toLowerCase().indexOf(val);
                let len = val.length;

                let SSpan = createDOM("span");
                let CSpan = createDOM("span");
                let ESpan = createDOM("span");

                CSpan.style.backgroundColor = "#0077ffff"
                CSpan.style.color = "#ffff"

                // PATH STYLE
                if(MODE.PATH){
                    SSpan.style.color = "#999999ff";
                    ESpan.style.color = "#999999ff";
                    SSpan.style.marginLeft = "20px";
                }

                // HIT
                if(startIdx != -1){
                SSpan.innerHTML = (MODE.ID ? " [" : "") + 
                                  objName.substring(0, startIdx);
                CSpan.innerHTML = objName.substring(startIdx, startIdx+len);
                ESpan.innerHTML = objName.substring(startIdx+len) + 
                                  (MODE.ID ? "] " : "");
                
                // NO HIT
                }else{
                    SSpan.innerHTML = (MODE.ID ? " [" : "") + objName + (MODE.ID ? "] " : "");
                }

                pgButton.appendChild(SSpan);
                pgButton.appendChild(CSpan);
                pgButton.appendChild(ESpan);

                tmpIdx++;
            }

            let id = pgObj["id"] + "_search";
            pgButton.id = id;

            // ADD EVENT
            pgButton.addEventListener("click",function(e){
                if(resHidden) resHidden.value = "PG" + "," + pgObj["id"];
                if(afterFunc) afterFunc();
                resultContainer.innerHTML = "";
            })

            // ICON
            const icon = createDOM("span");
            icon.innerHTML = `PG`;
            icon.style.marginRight = "5px";
            icon.style.marginLeft = "5px";
            icon.style.color = "#29bfdaff";
            // icon.style.fontWeight = "bold";
            pgButton.prepend(icon);

            // APPEND（重複回避）
            if(!getDOM(id)) resultContainer.appendChild(pgButton);

        }
    }

}











// region テストデータ
var mainData_TEST = 
{
  "WORK": [
    {
      "WORK_TASK": [
        {
          "id": "KGDFLguQvpqwYuJipMfF",
          "addedDate": "2025-09-16",
          "workCategory": "9MXyNpIdoCQ2XTYwOJwJ",
          "pgInfo": "製造> データ照会> 製造伝票照会 [CP801010_00]",
          "pgObjId": "BkoEifYZCmVGTPCCLlXo",
          "content": "新規作成",
          "dueDate": "2025-09-15",
          "progress": "64",
          "actHours": 0,
          "compDate": "",
          "memos": [
            {
              "id": "QVEnmszOc4gQ07aQRLtL",
              "title": "ドキュメント関連",
              "memoText": "・以下パスにExcelあり\nC//:User...\n\n"
            },
            {
              "id": "4MXF2D1qMJW6TZKoGsXz",
              "title": "内容",
              "memoText": "・SQL改修\n・帳票改修"
            },
            {
              "id": "tZr9wq9kIJAw6spcvrHU",
              "title": "懸念",
              "memoText": "・出来高と消費財の条件が混在\n　SQLの構造が根本的に変わる可能性あり"
            },
            {
              "id": "8JaWY48F4LTkbcJusFXw",
              "title": "Title4",
              "memoText": ""
            },
            {
              "id": "gvsrWccInbV8cewsCZ1v",
              "title": "Title5",
              "memoText": ""
            },
            {
              "id": "AdZZzdzINwIUJHlurHiZ",
              "title": "Title6",
              "memoText": ""
            },
            {
              "id": "8jtmPbqvXOfh1j2r39PL",
              "title": "Title7",
              "memoText": ""
            },
            {
              "id": "xtzg24aJYw5DBASNlqxg",
              "title": "Title8",
              "memoText": ""
            },
            {
              "id": "1xGaakzi0hOgIpvGB9JV",
              "title": "Title9",
              "memoText": ""
            },
            {
              "id": "f9sGmfm230vh7qeh6sNa",
              "title": "Title10",
              "memoText": ""
            },
            {
              "id": "y9JqtI8aPUYScb5yrsfI",
              "title": "Title11",
              "memoText": ""
            },
            {
              "id": "fe2CWxo3kF1ImPorNIJf",
              "title": "Title12",
              "memoText": ""
            }
          ]
        },
        {
          "id": "k1Aowp15tM0gm8CJsqao",
          "addedDate": "2025-09-15",
          "workCategory": "2AehAj90npZ3s7OvWbhi",
          "pgInfo": "仕入> 日時処理> 用途仕分入力 [CB209000_00]",
          "pgObjId": "tI05ExkjNKA8wG7tHGVJ",
          "content": "DSIMPができないバグ対応",
          "dueDate": "2025-09-17",
          "progress": "100",
          "actHours": 0,
          "compDate": "2025-12-31",
          "memos": []
        },
        {
          "id": "VVxKmT3JQhjJD10ZJpMc",
          "addedDate": "2025-09-15",
          "workCategory": "FVeexTroVIFHwoqNhw1x",
          "pgInfo": "製造> データ照会> 製造伝票照会 [CP801010_00]",
          "pgObjId": "BkoEifYZCmVGTPCCLlXo",
          "content": "テスト仕様書以下パスにあり",
          "dueDate": "2025-09-15",
          "progress": "100",
          "actHours": 0,
          "compDate": "2025-12-31",
          "memos": [
            {
              "id": "7vYW7bLu5taTUAJwV6p2",
              "title": "質問事項",
              "memoText": "・クレジット関連の制御\n・経路にて入力制限を行うべきか？\n・複数のクレジット情報を入力できていいのか？"
            },
            {
              "id": "FDdceuNF8VIAcyJ78K4W",
              "title": "Title2",
              "memoText": ""
            },
            {
              "id": "Z0407XVq5dLGXvIH6yEm",
              "title": "Title3",
              "memoText": ""
            },
            {
              "id": "dc9Ycrwjev5BnzOQ6mTH",
              "title": "Title4",
              "memoText": ""
            },
            {
              "id": "Id75d25Nv3WaUqLp7LjN",
              "title": "Title5",
              "memoText": ""
            },
            {
              "id": "EMVn9HNfep1bYTrQkoNF",
              "title": "Title6",
              "memoText": ""
            },
            {
              "id": "T6aHlFvGVKXkvywCKRcf",
              "title": "Title7",
              "memoText": ""
            },
            {
              "id": "o0iHREG8SO7jGDQSvWWj",
              "title": "Title8",
              "memoText": ""
            },
            {
              "id": "lraWUlYWVu8zbOWalOpJ",
              "title": "Title9",
              "memoText": ""
            },
            {
              "id": "SJTtVGDpTcXDRpyJcjMM",
              "title": "Title10",
              "memoText": ""
            },
            {
              "id": "0yrybtdlUM6YsLpkFo6A",
              "title": "Title11",
              "memoText": ""
            },
            {
              "id": "KTUzcMfCola0rmWwYXgo",
              "title": "Title12",
              "memoText": ""
            }
          ]
        },
        {
          "id": "M56ADBZa581Z0Azp8ibe",
          "addedDate": "2025-09-15",
          "workCategory": "HHIjISPrx7z6NaHKqfRB",
          "pgInfo": "仕入> 日時処理> 入札データ取込 [CB209040_00]",
          "pgObjId": "1UmD7NQoAAXzHATnOQ6N",
          "content": "色々と曖昧",
          "dueDate": "2025-09-15",
          "progress": 0,
          "actHours": 0,
          "compDate": "",
          "memos": []
        }
      ],
      "WORK_MEMO": [
        {
          "type": "folder",
          "name": "画面別",
          "content": "",
          "id": "w0V96AGb8zogPNPHpBpK",
          "parentCSV": "w0V96AGb8zogPNPHpBpK",
          "sortNo": 0,
          "statusIcon": null
        },
        {
          "type": "folder",
          "name": "用途入力",
          "content": "",
          "id": "uUznwiXaB4XwMBGMXanB",
          "parentCSV": "w0V96AGb8zogPNPHpBpK,uUznwiXaB4XwMBGMXanB",
          "sortNo": 0,
          "statusIcon": null
        },
        {
          "type": "folder",
          "name": "仕入入力",
          "content": "",
          "id": "UdpcdxuPgDtS9pHb5ECS",
          "parentCSV": "w0V96AGb8zogPNPHpBpK,UdpcdxuPgDtS9pHb5ECS",
          "sortNo": 0,
          "statusIcon": null
        },
        {
          "type": "file",
          "name": "残りタスク",
          "content": "",
          "id": "Xsvfw9oE378S05Q16Yqz",
          "parentCSV": "w0V96AGb8zogPNPHpBpK,Xsvfw9oE378S05Q16Yqz",
          "sortNo": 0,
          "statusIcon": "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 -960 960 960\" width=\"24px\" fill=\"#F3F3F3\"><path d=\"M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z\"/></svg>"
        },
        {
          "type": "file",
          "name": "概要",
          "content": "定義書を参照",
          "id": "A0hQd0gzEC265dLna5La",
          "parentCSV": "w0V96AGb8zogPNPHpBpK,uUznwiXaB4XwMBGMXanB,A0hQd0gzEC265dLna5La",
          "sortNo": 0,
          "statusIcon": null
        },
        {
          "type": "file",
          "name": "保留",
          "content": "排他チェック動確",
          "id": "yT41LaGMnUZxPENtNVal",
          "parentCSV": "w0V96AGb8zogPNPHpBpK,uUznwiXaB4XwMBGMXanB,yT41LaGMnUZxPENtNVal",
          "sortNo": 0,
          "statusIcon": null
        },
        {
          "type": "file",
          "name": "SQL",
          "content": "SELECT \n    MAX(DSMID)\nFROM DSH\nLEFT JOIN DSM ON DSMDSHID = DSHID\n    AND DSMMKCID = DSHMKCID\n    AND DSMNEND0 = DSHNEND0\nWHERE 1=1\n    AND DSHDENNO = 1720\nGROUP BY \n    DSHID",
          "id": "K8QJrx6hLPRn77O0Hhac",
          "parentCSV": "w0V96AGb8zogPNPHpBpK,uUznwiXaB4XwMBGMXanB,K8QJrx6hLPRn77O0Hhac",
          "sortNo": 0,
          "statusIcon": null
        },
        {
          "type": "file",
          "name": "概要",
          "content": "キャッシュ対応",
          "id": "njpqScAFD86nFP2zHy36",
          "parentCSV": "w0V96AGb8zogPNPHpBpK,UdpcdxuPgDtS9pHb5ECS,njpqScAFD86nFP2zHy36",
          "sortNo": 0,
          "statusIcon": null
        },
        {
          "type": "file",
          "name": "保留",
          "content": "とくになし",
          "id": "PiqJaYFiXHTlozIdqsP4",
          "parentCSV": "w0V96AGb8zogPNPHpBpK,UdpcdxuPgDtS9pHb5ECS,PiqJaYFiXHTlozIdqsP4",
          "sortNo": 0,
          "statusIcon": null
        },
        {
          "type": "file",
          "name": "SQL",
          "content": "SLEECT COUNT(*)\nFROM DSH",
          "id": "v7lpRLmfceUZdYpz0Jj1",
          "parentCSV": "w0V96AGb8zogPNPHpBpK,UdpcdxuPgDtS9pHb5ECS,v7lpRLmfceUZdYpz0Jj1",
          "sortNo": 0,
          "statusIcon": null
        },
        {
          "type": "file",
          "name": "備忘",
          "content": "ワーク絡みはすべて、キャッシュ分岐する共通関数へ渡せる形へ加工\n",
          "id": "32FIwvheZkKzvcxL3DXJ",
          "parentCSV": "w0V96AGb8zogPNPHpBpK,UdpcdxuPgDtS9pHb5ECS,32FIwvheZkKzvcxL3DXJ",
          "sortNo": 0,
          "statusIcon": null
        }
      ],
      "WORK_TOOLMANAGER": []
    }
  ],
  "MASTER": [
    {
      "MASTER_PGCATEGORY": [
        {
          "kaisoCount": "2"
        },
        {
          "kaiso1": [
            {
              "id": "GCu1qThs00Vo0wJaNzAg",
              "name": "製造"
            },
            {
              "id": "mU24w6lgTR16xztoRaHD",
              "name": "仕入"
            },
            {
              "id": "wWhKsCGwhpOyMx9q3y4H",
              "name": "在庫"
            },
            {
              "id": "66SmE4kWZnEInT9WyS2R",
              "name": "マスタ"
            }
          ]
        },
        {
          "kaiso2": [
            {
              "id": "lLcVZtE1zEpo9nD3y94h",
              "name": "月次処理",
              "kaiso1ID": "GCu1qThs00Vo0wJaNzAg"
            },
            {
              "id": "76ehunl80GBggiBLKVl8",
              "name": "日時処理",
              "kaiso1ID": "GCu1qThs00Vo0wJaNzAg"
            },
            {
              "id": "jJsj7RWlpJBEa9UPOV74",
              "name": "データ照会",
              "kaiso1ID": "GCu1qThs00Vo0wJaNzAg"
            },
            {
              "id": "TEZDpSKvzB060KtJfGUp",
              "name": "日時処理",
              "kaiso1ID": "mU24w6lgTR16xztoRaHD"
            },
            {
              "id": "MAkyW6Hy38GpiN0a5svn",
              "name": "月次処理",
              "kaiso1ID": "mU24w6lgTR16xztoRaHD"
            },
            {
              "id": "p7GNdldOzgpzc53TFKNV",
              "name": "データ照会",
              "kaiso1ID": "mU24w6lgTR16xztoRaHD"
            },
            {
              "id": "RQZfoCaYhD8jDPk0Uxa9",
              "name": "日時処理",
              "kaiso1ID": "wWhKsCGwhpOyMx9q3y4H"
            },
            {
              "id": "NEe94akwbPnxp0VhoJJI",
              "name": "月次処理",
              "kaiso1ID": "wWhKsCGwhpOyMx9q3y4H"
            },
            {
              "id": "ytYAd7zAoTYXGNDyxlZV",
              "name": "データ照会",
              "kaiso1ID": "wWhKsCGwhpOyMx9q3y4H"
            }
          ]
        },
        {
          "kaiso3": [
            {
              "id": "B7wPrZHtc7Lh8jlOl2Fr",
              "name": "処理締め",
              "kaiso1ID": "GCu1qThs00Vo0wJaNzAg",
              "kaiso2ID": "lLcVZtE1zEpo9nD3y94h"
            },
            {
              "id": "BjTuYNv2R1IHtCyN5KYd",
              "name": "製造登録",
              "kaiso1ID": "GCu1qThs00Vo0wJaNzAg",
              "kaiso2ID": "76ehunl80GBggiBLKVl8"
            },
            {
              "id": "a7ChzT6r1o1stqAUTUrl",
              "name": "製造登録２",
              "kaiso1ID": "GCu1qThs00Vo0wJaNzAg",
              "kaiso2ID": "76ehunl80GBggiBLKVl8"
            }
          ]
        },
        {
          "kaiso4": []
        }
      ],
      "MASTER_PGINFO": [
        {
          "id": "BkoEifYZCmVGTPCCLlXo",
          "pgid": "CP801010_00",
          "name": "製造伝票照会",
          "kaisoCSV": "GCu1qThs00Vo0wJaNzAg,jJsj7RWlpJBEa9UPOV74",
          "remark": "CSV対応済み"
        },
        {
          "id": "AJA8LdxpBgUvSiyy1QKo",
          "pgid": "CB100000_00",
          "name": "締め処理",
          "kaisoCSV": "mU24w6lgTR16xztoRaHD,MAkyW6Hy38GpiN0a5svn",
          "remark": ""
        },
        {
          "id": "tWgLjyfQt5UebAhuj5yh",
          "pgid": "CB203030_00",
          "name": "仕入入力",
          "kaisoCSV": "mU24w6lgTR16xztoRaHD,TEZDpSKvzB060KtJfGUp",
          "remark": ""
        },
        {
          "id": "tI05ExkjNKA8wG7tHGVJ",
          "pgid": "CB209000_00",
          "name": "用途仕分入力",
          "kaisoCSV": "mU24w6lgTR16xztoRaHD,TEZDpSKvzB060KtJfGUp",
          "remark": ""
        },
        {
          "id": "1UmD7NQoAAXzHATnOQ6N",
          "pgid": "CB209040_00",
          "name": "入札データ取込",
          "kaisoCSV": "mU24w6lgTR16xztoRaHD,TEZDpSKvzB060KtJfGUp",
          "remark": ""
        }
      ],
      "MASTER_WORKCATEGORY": [
        {
          "id": "9MXyNpIdoCQ2XTYwOJwJ",
          "name": "新規作成"
        },
        {
          "id": "2AehAj90npZ3s7OvWbhi",
          "name": "改修"
        },
        {
          "id": "FVeexTroVIFHwoqNhw1x",
          "name": "テスト"
        },
        {
          "id": "HHIjISPrx7z6NaHKqfRB",
          "name": "詳細設計"
        }
      ],
      "MASTER_TAGMANAGER": []
    }
  ],
  "META": [
    {
      "PROJECTNAME": "茶管"
    }
  ],
  "AI": [
    {
      "AI_AGENCY": []
    }
  ]
}