<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
<title>号码切割工具</title>


<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif;
  -webkit-font-smoothing: antialiased;
}

body {
  background: #f5f5f7;
  padding: 60px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.lang-switch {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 90px;
  height: 36px;
  border-radius: 18px;
  background: #007aff;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  z-index: 999;
  transition: 0.25s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lang-switch:hover {
  background: #0062cc;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,122,255,0.25);
}

.page-title {
  padding: 20px 0;
  margin: 0 0 28px 0;
  font-size: 34px;
  font-weight: 700;
  color: #1d1d1f;
  text-align: center;
  letter-spacing: -0.5px;
}

.top-row {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

.col-input { width: 30%; }
.col-middle { width: 30%; display: flex; flex-direction: column; gap: 24px; }
.col-right { width: 40%; display: flex; flex-direction: column; gap: 24px; }

/* ========== 核心修改：三个卡片全部用固定高度 ========== */
.stat-card {
  width: 100%;
  height: 280px; /* 固定高度，和下面两个完全一样 */
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
}
.stat-num {
  font-size: 32px;
  font-weight: 700;
  color: #007aff;
  margin-bottom: 4px;
}
.stat-label {
  font-size: 18px;
  color: #86868b;
}
.preview-tip {
  font-size: 12px;
  color: #007aff;
  margin-top: 4px;
  display: none;
}
.stat-card[clickable="true"] .preview-tip {
  display: block;
}

.stat-row {
  display: flex;
  gap: 12px;
  width: 100%;
}
.stat-row .stat-card {
  height: 220px; /* 和上面的固定高度完全一致 */
}

.card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  padding: 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: 0.28s;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
}
.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 24px;
}
#numberInput {
  flex: 1;
  width: 100%;
  border: none;
  background: #f9f9fb;
  border-radius: 12px;
  padding: 20px;
  font-size: 15px;
  resize: none;
  color: #1d1d1f;
  max-height: 500px;
}
#numberInput:focus {
  outline: none;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0,122,255,0.15);
}

.import-card { height: 280px; }
.drop-area {
  flex: 1;
  border: 2px dashed #d2d2d7;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #86868b;
  cursor: pointer;
  background: #fafafa;
}
.drop-area.dragover {
  border-color: #007aff;
  color: #007aff;
  background: rgba(0,122,255,0.06);
}
.drop-title { font-size: 16px; font-weight: 500; margin-bottom: 6px; }
.drop-desc { font-size: 13px; text-align: center; line-height: 1.4; }

/* 隐藏文件选择按钮 */
#fileInput {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  overflow: hidden;
}

.config-card { height: auto; min-height: 380px; }
.config-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}
.config-item {
  display: flex;
  align-items: center;
  padding: 18px 20px;
  background: #f9f9fb;
  border: 1px solid #e5e5ea;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
  width: 100%;
  height: 64px;
  position: relative;
}
.config-item.active {
  background: #e4f3ff;
  border-color: #007aff;
}
.config-text {
  flex: 1;
  font-size: 16px;
  color: #1d1d1f;
  font-weight: 500;
}
.config-input {
  width: 120px;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #e5e5ea;
  border-radius: 8px;
  font-size: 16px;
  text-align: center;
}
.config-input:focus {
  outline: none;
  border-color: #007aff;
}
.seg-status {
  position: absolute;
  right: 16px;
  bottom: 4px;
  font-size: 12px;
  font-weight: 500;
}
.seg-status.unadded { color: #ff9500; }
.seg-status.added { color: #34c759; }

.btn {
  height: 44px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: 0.25s;
  padding: 0 20px;
}
.btn-primary {
  background: #007aff;
  color: #fff;
}
.btn-primary:hover {
  background: #0062cc;
}
.btn-block {
  height: 56px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.btn-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
}
.btn-main {
  background: #007aff;
  color: #fff;
}
.btn-second {
  background: #f2f2f7;
  color: #1d1d1f;
}
button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.loading-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,0.8);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  color: #007aff;
}
.loading-mask.show { display: flex; }

.preview-wrapper {
  margin-top: 12px;
  display: none;
}
.preview-card {
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  padding: 28px;
  max-height: 600px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.preview-header {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.preview-header .btn {
  flex: 1;
  min-width: 160px;
}
.preview-table-container {
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
  max-height: 450px;
  border-radius: 12px;
  border: 1px solid #f0f0f5;
}
.preview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 800px;
}
.preview-table th {
  background: #f9f9fb;
  font-weight: 600;
  padding: 12px 16px;
  text-align: center;
  border-bottom: 1px solid #e5e5ea;
  cursor: pointer;
  position: sticky;
  top: 0;
  z-index: 10;
}
.preview-table th.active {
  background: #d1e7ff;
  color: #007aff;
}
.preview-table td {
  padding: 10px 16px;
  text-align: center;
  border-bottom: 1px solid #f0f0f5;
}
.preview-table tr:nth-child(even) {
  background: #f9f9fb;
}

.list-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 999999;
  display: none;
  align-items: center;
  justify-content: center;
}
.list-modal.show { display: flex; }
.list-box {
  background: #fff;
  width: 90%;
  max-width: 600px;
  border-radius: 20px;
  padding: 30px;
  max-height: 80vh;
  overflow-y: auto;
}
.list-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
}
.list-content {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  background: #f9f9fb;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-line;
}
.list-close {
  margin-top: 20px;
  width: 100%;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 99999;
  display: none;
  align-items: center;
  justify-content: center;
}
.modal-overlay.show { display: flex; }
.modal-split {
  width: 900px;
  max-width: 95vw;
  display: flex;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
}
.modal-left {
  width: 50%;
  padding: 24px;
  border-right: 1px solid #e5e5ea;
}
.modal-right {
  width: 50%;
  padding: 24px;
  display: flex;
  flex-direction: column;
}
.modal-header {
  margin-bottom: 20px;
}
.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
}
.modal-close {
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: #86868b;
  cursor: pointer;
}
.modal-form-item {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.modal-form-item label {
  font-size: 14px;
  font-weight: 500;
  color: #1d1d1f;
}
.modal-form-item input,
.modal-form-item select {
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e5e5ea;
  font-size: 15px;
  background: #f9f9fb;
}
.modal-form-item input:focus,
.modal-form-item select:focus {
  outline: none;
  border-color: #007aff;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0,122,255,0.15);
}
.segment-item {
  padding: 12px 14px;
  background: #f9f9fb;
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.segment-text {
  font-size: 14px;
  color: #1d1d1f;
}
.added-list {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
}
.modal-footer {
  margin-top: 20px;
  text-align: right;
}

@media (min-width: 769px) {
  #shareSelectedTxt,
  #shareAllTxt {
    display: none !important;
  }
}

@media (max-width: 768px) {
  body {
    padding: 60px 12px 20px;
  }
  .page-title {
    font-size: 24px;
  }
  .top-row {
    flex-direction: column;
    gap: 16px;
  }
  .col-input, .col-middle, .col-right {
    width: 100%;
  }

  /* 手机端卡片自动高度，不挤压、不拉伸 */
  .stat-card {
    height: auto !important;
    min-height: 120px !important;
    padding: 20px;
  }
  .stat-row {
    flex-direction: column;
    gap: 12px;
  }

  /* 按钮间距优化 */
  .col-right {
    gap: 12px !important;
  }
  .btn-block {
    height: 50px;
  }

  /* 手机端预览表格横向滚动更友好 */
  .preview-table {
    min-width: 600px;
  }
  .preview-header {
    gap: 8px;
  }
  .preview-header .btn {
    min-width: 140px;
    font-size: 13px;
    padding: 0 10px;
  }

  /* 弹窗适配手机 */
  .modal-split {
    flex-direction: column;
    width: 95vw;
  }
  .modal-left, .modal-right {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e5ea;
  }
  .modal-right {
    border-bottom: none;
    max-height: 50vh;
  }
}
</style>
</head>
<body>
<div class="loading-mask" id="loading">处理中...</div>
<button class="lang-switch" id="langSwitch">English</button>

<div class="container">
  <h1 class="page-title" data-i18n="page_title">号码切割工具</h1>
  <div class="top-row">
    <!-- 左侧：号码输入 -->
    <div class="col-input">
      <div class="card">
        <h2 class="card-title" data-i18n="input_title">号码输入</h2>
        <textarea id="numberInput" placeholder="示例：+1 (500) 000-0000" data-i18n-placeholder="input_placeholder"></textarea>
      </div>
    </div>

    <!-- 中间：文件导入 + 切割配置 -->
    <div class="col-middle">
      <div class="card import-card">
        <h2 class="card-title" data-i18n="import_title">文件导入</h2>
        <div class="drop-area" id="dropArea">
          <div class="drop-title" data-i18n="drop_title">点击或拖入文件</div>
          <div class="drop-desc" data-i18n="drop_desc">支持 TXT</div>
        </div>
        <input type="file" id="fileInput" accept=".txt">
      </div>

      <div class="card config-card">
        <h2 class="card-title" data-i18n="config_title">切割配置</h2>
        <div class="config-group">
          <div class="config-item active" data-mode="size">
            <div class="config-text" data-i18n="size_text">按每份数量切割</div>
            <input type="number" class="config-input" min="1" value="2000">
          </div>
          <div class="config-item" data-mode="count">
            <div class="config-text" data-i18n="count_text">按总份数平均</div>
            <input type="number" class="config-input" min="1" value="5">
          </div>
          <div class="config-item" data-mode="advanced">
            <div class="config-text" data-i18n="advanced_text">自定义分段切割</div>
            <div class="seg-status unadded" data-i18n="unadded">⚠️ 未添加分段配置</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧：统计卡片 + 操作按钮 -->
    <div class="col-right">
      <!-- 有效号码卡片（固定高度） -->
      <div class="stat-card" id="validCard">
        <div class="stat-num" id="validNum">0</div>
        <div class="stat-label" data-i18n="valid_label">有效号码</div>
      </div>
      <!-- 重复/无效号码卡片（和上面高度完全一致） -->
      <div class="stat-row">
        <div class="stat-card" id="dupCard">
          <div class="stat-num" id="dupNum">0</div>
          <div class="stat-label" data-i18n="dup_label">重复号码</div>
          <div class="preview-tip" data-i18n="preview_tip">点击查看</div>
        </div>
        <div class="stat-card" id="invalidCard">
          <div class="stat-num" id="invalidNum">0</div>
          <div class="stat-label" data-i18n="invalid_label">无效号码</div>
          <div class="preview-tip" data-i18n="preview_tip">点击查看</div>
        </div>
      </div>

      <button class="btn btn-block btn-main" id="processBtn" disabled data-i18n="process_btn">开始处理</button>
      <button class="btn btn-block btn-second" id="clearBtn" data-i18n="clear_btn">清空重置</button>
    </div>
  </div>

  <div class="preview-wrapper" id="resultWrapper">
    <div class="preview-card">
      <div class="preview-header">
        <button class="btn" id="exportSelectedTxt" data-i18n="export_selected_txt">导出选中TXT</button>
        <button class="btn" id="shareSelectedTxt" data-i18n="share_selected_txt">分享选中TXT</button>
        <button class="btn" id="exportAllTxt" data-i18n="export_all_txt">导出全部TXT</button>
        <button class="btn" id="shareAllTxt" data-i18n="share_all_txt">分享全部TXT</button>
      </div>
      <div class="preview-table-container">
        <table class="preview-table" id="previewTable"></table>
      </div>
    </div>
  </div>
</div>

<div class="modal-overlay" id="segModal">
  <div class="modal-split">
    <div class="modal-left">
      <div class="modal-header">
        <h3 id="formTitle" data-i18n="add_segment">添加分段</h3>
      </div>
      <div class="modal-form-item">
        <label data-i18n="start_line">起始行</label>
        <input type="number" id="segStart" value="1">
      </div>
      <div class="modal-form-item">
        <label data-i18n="end_line">结束行</label>
        <input type="number" id="segEnd" placeholder="">
      </div>
      <div class="modal-form-item">
        <label data-i18n="split_type">切割方式</label>
        <select id="segType">
          <option value="split" data-i18n="split_by_size">按数量切</option>
          <option value="count" data-i18n="split_by_count">按份数平均切</option>
        </select>
      </div>
      <div class="modal-form-item" id="argWrap">
        <label id="argLabel" data-i18n="per_count">每组数量</label>
        <input type="number" id="segArg" value="2000">
      </div>
      <button class="btn btn-primary" id="saveSegBtn" data-i18n="add_btn">添加</button>
    </div>
    <div class="modal-right">
      <div class="modal-header">
        <h3 data-i18n="added_segments">已添加分段</h3>
      </div>
      <div class="added-list" id="addedList"></div>
      <div class="modal-footer">
        <button class="btn btn-primary" id="finishSegBtn" data-i18n="finish_btn">完成</button>
      </div>
    </div>
  </div>
  <button class="modal-close" id="closeSegModal">×</button>
</div>

<div class="list-modal" id="listModal">
  <div class="list-box">
    <div class="list-title" id="listTitle">预览</div>
    <div class="list-content" id="listContent"></div>
    <button class="btn btn-primary list-close" id="closeListModal">关闭</button>
  </div>
</div>

<script>
const i18n = {
  zh: {
    page_title: "号码切割工具",
    input_title: "号码输入",
    input_placeholder: "示例：+1 (500) 000-0000",
    import_title: "文件导入",
    drop_title: "点击或拖入文件",
    drop_desc: "支持 TXT",
    config_title: "切割配置",
    size_text: "按每份数量切割",
    count_text: "按总份数平均",
    advanced_text: "自定义分段切割",
    unadded: "⚠️ 未添加分段配置",
    added: "✅ 已添加分段配置",
    valid_label: "有效号码",
    dup_label: "重复号码",
    invalid_label: "无效号码",
    preview_tip: "点击查看",
    process_btn: "开始处理",
    clear_btn: "清空重置",
    export_selected_txt: "导出选中TXT",
    share_selected_txt: "分享选中TXT",
    export_all_txt: "导出全部TXT",
    share_all_txt: "分享全部TXT",
    add_segment: "添加分段",
    start_line: "起始行",
    end_line: "结束行",
    split_type: "切割方式",
    split_by_size: "按数量切",
    split_by_count: "按份数平均切",
    per_count: "每组数量",
    per_count_count: "分成几份",
    add_btn: "添加",
    edit_btn: "修改",
    del_btn: "删除",
    added_segments: "已添加分段",
    finish_btn: "完成",
    group: "第{{index}}组({{count}}个)",
    overlap_error: "❌ 该区间与已添加分段重叠，禁止添加！",
    s_gt_e_error: "❌ 起始行不能大于结束行！",
    gt0_error: "❌ 行号必须大于0！",
    invalid_size_error: "❌ 每组数量必须大于0且不大于分段长度！",
    invalid_count_error: "❌ 份数必须大于0且不大于分段长度！",
    select_tip: "请先选中分组"
  },
  en: {
    page_title: "Number Splitter",
    input_title: "Numbers",
    input_placeholder: "Example: +1 (500) 000-0000",
    import_title: "Import",
    drop_title: "Click or Drag",
    drop_desc: "TXT only",
    config_title: "Split Config",
    size_text: "By Size",
    count_text: "By Count",
    advanced_text: "Custom Split",
    unadded: "⚠️ No segments",
    added: "✅ Ready",
    valid_label: "Valid",
    dup_label: "Duplicates",
    invalid_label: "Invalid",
    preview_tip: "Click to view",
    process_btn: "Process",
    clear_btn: "Reset",
    export_selected_txt: "Export Selected",
    share_selected_txt: "Share Selected",
    export_all_txt: "Export All",
    share_all_txt: "Share All",
    add_segment: "Add Segment",
    start_line: "Start",
    end_line: "End",
    split_type: "Mode",
    split_by_size: "By Size",
    split_by_count: "By Count",
    per_count: "Size",
    per_count_count: "Count",
    add_btn: "Add",
    edit_btn: "Edit",
    del_btn: "Delete",
    added_segments: "Segments",
    finish_btn: "Done",
    group: "G{{index}}-{{count}}",
    overlap_error: "Overlap!",
    s_gt_e_error: "Start > End!",
    gt0_error: "Must >0",
    invalid_size_error: "Invalid size",
    invalid_count_error: "Invalid count",
    select_tip: "Select groups first"
  }
};

let currentLang = "zh";
let selectedGroups = new Set();
let validNumbers = [];
let duplicateNumbers = [];
let invalidNumbers = [];
let chunks = [];
let currentMode = "size";
let segmentList = [];
let editIndex = -1;

const el = {
  numberInput: document.getElementById('numberInput'),
  dropArea: document.getElementById('dropArea'),
  fileInput: document.getElementById('fileInput'),
  processBtn: document.getElementById('processBtn'),
  clearBtn: document.getElementById('clearBtn'),
  validNum: document.getElementById('validNum'),
  dupNum: document.getElementById('dupNum'),
  invalidNum: document.getElementById('invalidNum'),
  dupCard: document.getElementById('dupCard'),
  invalidCard: document.getElementById('invalidCard'),
  resultWrapper: document.getElementById('resultWrapper'),
  previewTable: document.getElementById('previewTable'),
  langSwitch: document.getElementById('langSwitch'),
  exportSelectedTxt: document.getElementById('exportSelectedTxt'),
  shareSelectedTxt: document.getElementById('shareSelectedTxt'),
  exportAllTxt: document.getElementById('exportAllTxt'),
  shareAllTxt: document.getElementById('shareAllTxt'),
  loading: document.getElementById('loading'),
  advancedItem: document.querySelector('.config-item[data-mode="advanced"]'),
  segStatus: document.querySelector('.seg-status')
};

const segEl = {
  modal: document.getElementById('segModal'),
  closeX: document.getElementById('closeSegModal'),
  formTitle: document.getElementById('formTitle'),
  start: document.getElementById('segStart'),
  end: document.getElementById('segEnd'),
  type: document.getElementById('segType'),
  argWrap: document.getElementById('argWrap'),
  argLabel: document.getElementById('argLabel'),
  arg: document.getElementById('segArg'),
  saveBtn: document.getElementById('saveSegBtn'),
  addedList: document.getElementById('addedList'),
  finishBtn: document.getElementById('finishSegBtn')
};

const listModal = document.getElementById('listModal');
const listTitle = document.getElementById('listTitle');
const listContent = document.getElementById('listContent');
const closeListModal = document.getElementById('closeListModal');

closeListModal.onclick = () => listModal.classList.remove('show');

el.dupCard.onclick = () => {
  if (duplicateNumbers.length === 0) return;
  listTitle.textContent = currentLang === "zh" ? "重复号码列表" : "Duplicates List";
  listContent.textContent = duplicateNumbers.join('\n');
  listModal.classList.add('show');
};
el.invalidCard.onclick = () => {
  if (invalidNumbers.length === 0) return;
  listTitle.textContent = currentLang === "zh" ? "无效号码列表" : "Invalid List";
  listContent.textContent = invalidNumbers.join('\n');
  listModal.classList.add('show');
};

function cleanPhone(s) {
  // 统一清洗成 11 位、开头带 1 的号码：1XXXXXXXXXX
  // 支持格式示例：5000000000、15000000000、+1 (500) 000-0000、1-500-000-0000。
  // 如果一行里带空格、括号、横线等符号，会先去掉非数字字符。
  const digits = String(s || '').replace(/\D/g, '');
  if (!digits) return null;

  let core10 = '';

  if (digits.length >= 11 && digits.startsWith('1')) {
    // 1 + 10 位，后面如果有备注/分机数字，忽略 11 位之后的内容。
    core10 = digits.slice(1, 11);
  } else if (digits.length >= 10) {
    // 没有国家码 1 的号码，取前 10 位并补 1。
    core10 = digits.slice(0, 10);
  } else {
    return null;
  }

  if (core10.length !== 10) return null;
  return '1' + core10;
}

function updateStats() {
  const t = el.numberInput.value.trim();
  if (!t) {
    validNumbers = [];
    duplicateNumbers = [];
    invalidNumbers = [];
    el.validNum.textContent = 0;
    el.dupNum.textContent = 0;
    el.invalidNum.textContent = 0;
    el.processBtn.disabled = true;
    el.dupCard.removeAttribute('clickable');
    el.invalidCard.removeAttribute('clickable');
    return;
  }

  const lines = t.split(/\n/).map(s => s.trim()).filter(Boolean);
  const cleaned = lines.map(s => cleanPhone(s)).filter(x => x !== null);
  const unique = [...new Set(cleaned)];
  
  const dupMap = {};
  cleaned.forEach(n => {
    dupMap[n] = (dupMap[n] || 0) + 1;
  });
  const dups = [];
  for (const k in dupMap) {
    if (dupMap[k] > 1) dups.push(k);
  }

  const inv = lines.filter(s => cleanPhone(s) === null);

  validNumbers = unique;
  duplicateNumbers = dups;
  invalidNumbers = inv;

  el.validNum.textContent = unique.length;
  el.dupNum.textContent = dups.length;
  el.invalidNum.textContent = inv.length;
  el.processBtn.disabled = !unique.length;

  if (dups.length > 0) el.dupCard.setAttribute('clickable', 'true');
  else el.dupCard.removeAttribute('clickable');
  
  if (inv.length > 0) el.invalidCard.setAttribute('clickable', 'true');
  else el.invalidCard.removeAttribute('clickable');
}

el.langSwitch.addEventListener('click', () => {
  currentLang = currentLang === "zh" ? "en" : "zh";
  el.langSwitch.textContent = currentLang === "zh" ? "English" : "中文";
  updateI18n();
  updateSegStatus();
  renderTable();
});

function updateI18n() {
  const lang = i18n[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(e => {
    e.textContent = lang[e.dataset.i18n];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(e => {
    e.placeholder = lang[e.dataset.i18nPlaceholder];
  });
  const opts = segEl.type.options;
  opts[0].textContent = lang.split_by_size;
  opts[1].textContent = lang.split_by_count;
  segEl.argLabel.textContent = segEl.type.value === "split" ? lang.per_count : lang.per_count_count;
}

function initFileDrop() {
  el.dropArea.onclick = () => el.fileInput.click();
  el.fileInput.onchange = () => {
    const f = el.fileInput.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = e => { el.numberInput.value = e.target.result; updateStats(); };
    r.readAsText(f);
  };
  el.dropArea.addEventListener('dragover', (e) => { e.preventDefault(); el.dropArea.classList.add('dragover'); });
  el.dropArea.addEventListener('dragenter', (e) => { e.preventDefault(); el.dropArea.classList.add('dragover'); });
  el.dropArea.addEventListener('dragleave', () => { el.dropArea.classList.remove('dragover'); });
  el.dropArea.addEventListener('drop', (e) => {
    e.preventDefault(); el.dropArea.classList.remove('dragover');
    const f = e.dataTransfer.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = e => { el.numberInput.value = e.target.result; updateStats(); };
    r.readAsText(f);
  });
}

document.querySelectorAll('.config-item').forEach(item => {
  item.onclick = () => {
    document.querySelectorAll('.config-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    currentMode = item.dataset.mode;
    if (currentMode === 'advanced') openSegModal();
  };
});

function updateSegStatus() {
  const lang = i18n[currentLang];
  if (segmentList.length > 0) {
    el.segStatus.textContent = lang.added;
    el.segStatus.className = "seg-status added";
  } else {
    el.segStatus.textContent = lang.unadded;
    el.segStatus.className = "seg-status unadded";
  }
}

function isFullyCovered() {
  const total = validNumbers.length;
  if (total === 0) return false;
  const used = new Set();
  segmentList.forEach(s => { for (let i = s.start; i <= s.end; i++) used.add(i); });
  for (let i = 1; i <= total; i++) if (!used.has(i)) return false;
  return true;
}

function isOverlap(newStart, newEnd) {
  for (let i = 0; i < segmentList.length; i++) {
    if (i === editIndex) continue;
    const seg = segmentList[i];
    if (!(newEnd < seg.start || newStart > seg.end)) return true;
  }
  return false;
}

function openSegModal() {
  editIndex = -1;
  const lang = i18n[currentLang];
  segEl.formTitle.textContent = lang.add_segment;
  segEl.saveBtn.textContent = lang.add_btn;

  let nextStart = 1;
  if (segmentList.length > 0) {
    const last = segmentList[segmentList.length - 1];
    nextStart = last.end + 1;
  }
  const maxEnd = validNumbers.length || 0;
  if (nextStart > maxEnd) nextStart = "";

  const maxText = currentLang === "zh" ? `最大: ${maxEnd}` : `Max: ${maxEnd}`;
  segEl.start.value = nextStart || "";
  segEl.end.placeholder = maxEnd > 0 ? maxText : "";
  segEl.end.value = "";
  segEl.type.value = "split";
  segEl.arg.value = 2000;
  segEl.argWrap.style.display = "block";
  segEl.modal.classList.add("show");
  renderAddedList();

  const full = isFullyCovered();
  segEl.saveBtn.disabled = full;
  segEl.saveBtn.title = full ? (currentLang === "zh" ? "已全覆盖" : "All covered") : "";
}

function closeSegModal() { segEl.modal.classList.remove("show"); }
segEl.closeX.addEventListener('click', closeSegModal);
segEl.finishBtn.addEventListener('click', closeSegModal);

segEl.type.addEventListener('change', () => {
  const lang = i18n[currentLang];
  const t = segEl.type.value;
  segEl.argLabel.textContent = t === 'split' ? lang.per_count : lang.per_count_count;
  segEl.arg.value = t === 'split' ? 2000 : 5;
});

segEl.saveBtn.addEventListener('click', () => {
  const maxEnd = validNumbers.length || 0;
  let s = parseInt(segEl.start.value) || 0;
  let e = parseInt(segEl.end.value) || 0;
  const t = segEl.type.value;
  let a = parseInt(segEl.arg.value);
  const lang = i18n[currentLang];

  if (isFullyCovered()) { segEl.saveBtn.disabled = true; return; }
  if (s <= 0 || e <= 0) { alert(lang.gt0_error); return; }
  if (s > e) { alert(lang.s_gt_e_error); return; }
  if (e > maxEnd && maxEnd > 0) e = maxEnd;
  if (isOverlap(s, e)) { alert(lang.overlap_error); return; }

  const segLength = e - s + 1;
  if (t === 'split' && (a <= 0 || a > segLength)) {
    alert(lang.invalid_size_error); return;
  }
  if (t === 'count' && (a <= 0 || a > segLength)) {
    alert(lang.invalid_count_error); return;
  }

  const item = { start: s, end: e, type: t, arg: a };
  if (editIndex === -1) segmentList.push(item);
  else segmentList[editIndex] = item;

  updateSegStatus();
  renderAddedList();

  const full = isFullyCovered();
  segEl.saveBtn.disabled = full;
  segEl.saveBtn.title = full ? (currentLang === "zh" ? "已全覆盖" : "All covered") : "";

  if (full) { segEl.start.value = ""; segEl.end.value = ""; }
  else { segEl.start.value = e + 1; segEl.end.value = ""; }

  editIndex = -1;
  segEl.formTitle.textContent = lang.add_segment;
  segEl.saveBtn.textContent = lang.add_btn;
});

function renderAddedList() {
  segEl.addedList.innerHTML = "";
  const lang = i18n[currentLang];
  segmentList.forEach((seg, i) => {
    let tt = seg.type === 'split' ? `${lang.split_by_size} ${seg.arg}` : `${lang.split_by_count} ${seg.arg}`;
    const txt = `${seg.start}~${seg.end} | ${tt}`;
    const div = document.createElement('div');
    div.className = 'segment-item';
    div.innerHTML = `
      <span class="segment-text">${txt}</span>
      <div>
        <button class="btn btn-sm btn-edit" data-i="${i}">${lang.edit_btn}</button>
        <button class="btn btn-sm btn-del" data-i="${i}">${lang.del_btn}</button>
      </div>
    `;
    segEl.addedList.appendChild(div);
  });
  document.querySelectorAll('.btn-edit').forEach(b => {
    b.onclick = () => {
      const i = parseInt(b.dataset.i);
      const seg = segmentList[i];
      editIndex = i;
      const lang = i18n[currentLang];
      segEl.formTitle.textContent = lang.edit_btn;
      segEl.saveBtn.textContent = lang.edit_btn;
      segEl.start.value = seg.start;
      segEl.end.value = seg.end;
      segEl.type.value = seg.type;
      segEl.arg.value = seg.arg;
      segEl.saveBtn.disabled = false;
      segEl.saveBtn.title = "";
    };
  });
  document.querySelectorAll('.btn-del').forEach(b => {
    b.onclick = () => {
      const i = parseInt(b.dataset.i);
      segmentList.splice(i, 1);
      renderAddedList();
      updateSegStatus();
      const full = isFullyCovered();
      segEl.saveBtn.disabled = full;
      segEl.saveBtn.title = full ? (currentLang === "zh" ? "已全覆盖" : "All covered") : "";
    };
  });
}

el.numberInput.addEventListener('input', updateStats);

function getPositiveInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function getUncoveredCount() {
  const total = validNumbers.length;
  if (!total || segmentList.length === 0) return total;

  const covered = new Set();
  segmentList.forEach(seg => {
    const start = Math.max(1, seg.start);
    const end = Math.min(total, seg.end);
    for (let i = start; i <= end; i++) covered.add(i);
  });

  return Math.max(0, total - covered.size);
}

el.processBtn.addEventListener('click', () => {
  if (!validNumbers.length) return;
  el.loading.classList.add('show');
  setTimeout(() => {
    if (currentMode === 'advanced') {
      if (segmentList.length === 0) {
        alert(i18n[currentLang].unadded);
        openSegModal();
        el.loading.classList.remove('show');
        return;
      }
      const missing = getUncoveredCount();
      if (missing > 0) {
        const ok = confirm(currentLang === "zh"
          ? ("还有 " + missing + " 个有效号码未被任何分段覆盖，是否继续？")
          : (missing + " valid numbers are not covered by any segment. Continue?"));
        if (!ok) {
          el.loading.classList.remove('show');
          return;
        }
      }
      doAdvanced();
    } else {
      doNormal();
    }
    el.resultWrapper.style.display = 'block';
    el.loading.classList.remove('show');
  }, 100);
});

function doNormal() {
  chunks = [];
  selectedGroups.clear();
  const vals = document.querySelectorAll('.config-input');

  if (currentMode === 'size') {
    const size = getPositiveInt(vals[0].value, 2000);
    for (let i = 0; i < validNumbers.length; i += size) {
      chunks.push(validNumbers.slice(i, i + size));
    }
  } else {
    const cnt = getPositiveInt(vals[1].value, 5);
    const per = Math.max(1, Math.ceil(validNumbers.length / cnt));
    for (let i = 0; i < validNumbers.length; i += per) {
      chunks.push(validNumbers.slice(i, i + per));
    }
  }

  renderTable();
}

function doAdvanced() {
  chunks = []; selectedGroups.clear();
  segmentList.forEach(seg => {
    const slice = validNumbers.slice(seg.start - 1, seg.end);
    if (!slice.length) return;
    if (seg.type === 'split') {
      const s = seg.arg;
      for (let i = 0; i < slice.length; i += s) chunks.push(slice.slice(i, i + s));
    } else {
      const c = seg.arg;
      const p = Math.ceil(slice.length / c);
      for (let i = 0; i < slice.length; i += p) chunks.push(slice.slice(i, i + p));
    }
  });
  renderTable();
}

function getGroupTitle(i) {
  const lang = i18n[currentLang];
  return lang.group.replace('{{index}}', i + 1).replace('{{count}}', chunks[i].length);
}

function refreshColumnSelection(index) {
  const active = selectedGroups.has(index);
  const th = el.previewTable.querySelector('th[data-i="' + index + '"]');
  if (th) {
    th.classList.toggle('active', active);
    th.textContent = (active ? '✓ ' : '') + getGroupTitle(index);
  }
  el.previewTable.querySelectorAll('td[data-i="' + index + '"]').forEach(td => {
    td.classList.toggle('active-col', active);
  });
}

function toggleGroupSelection(index) {
  index = parseInt(index, 10);
  if (!Number.isInteger(index) || index < 0 || index >= chunks.length) return;

  if (selectedGroups.has(index)) selectedGroups.delete(index);
  else selectedGroups.add(index);

  refreshColumnSelection(index);
}

function getSelectedGroupIndexes() {
  // 从 Set 和表头 active 状态双重读取，避免 UI 状态和导出状态不同步。
  const merged = new Set();

  selectedGroups.forEach(i => {
    if (Number.isInteger(i) && i >= 0 && i < chunks.length) merged.add(i);
  });

  el.previewTable.querySelectorAll('th.active[data-i]').forEach(th => {
    const i = parseInt(th.dataset.i, 10);
    if (Number.isInteger(i) && i >= 0 && i < chunks.length) merged.add(i);
  });

  selectedGroups = merged;
  return [...merged].sort((a, b) => a - b);
}

function renderTable() {
  el.previewTable.innerHTML = '';
  const maxRow = Math.max(...chunks.map(c => c.length), 0);
  const head = document.createElement('thead');
  const htr = document.createElement('tr');

  chunks.forEach((c, i) => {
    const th = document.createElement('th');
    th.dataset.i = i;
    th.title = currentLang === "zh" ? "点击选择/取消该分组" : "Click to select/unselect this group";
    th.onclick = () => toggleGroupSelection(i);
    htr.appendChild(th);
  });

  head.appendChild(htr);
  el.previewTable.appendChild(head);

  const body = document.createElement('tbody');
  for (let r = 0; r < maxRow; r++) {
    const tr = document.createElement('tr');
    chunks.forEach((c, i) => {
      const td = document.createElement('td');
      td.textContent = c[r] || '';
      td.dataset.i = i;
      td.title = currentLang === "zh" ? "点击选择/取消该分组" : "Click to select/unselect this group";
      td.onclick = () => toggleGroupSelection(i);
      tr.appendChild(td);
    });
    body.appendChild(tr);
  }
  el.previewTable.appendChild(body);

  chunks.forEach((_, i) => refreshColumnSelection(i));
}

function safeFileName(name) {
  return String(name).replace(/[\\/:*?"<>|]/g, '_');
}

function getGroupFileName(i) {
  return safeFileName(getGroupTitle(i) + '.txt');
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

function makeTxtBlob(chunk) {
  return new Blob([chunk.join('\n')], { type: 'text/plain;charset=utf-8' });
}

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = (CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8)) >>> 0;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function getDosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { dosTime, dosDate };
}

function createZipFromIndexes(indexArray) {
  if (!indexArray.length) throw new Error('No files selected');
  if (indexArray.length > 65535) throw new Error('Too many files for standard ZIP');

  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  const { dosTime, dosDate } = getDosDateTime();
  let offset = 0;

  indexArray.forEach(i => {
    if (!chunks[i]) return;

    const fileName = getGroupFileName(i);
    const nameBytes = encoder.encode(fileName);
    const data = encoder.encode(chunks[i].join('\n'));
    const crc = crc32(data);

    if (data.byteLength > 0xffffffff) {
      throw new Error('Single file too large for standard ZIP');
    }

    const local = new ArrayBuffer(30 + nameBytes.length);
    const lv = new DataView(local);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0x0800, true); // UTF-8 file name
    lv.setUint16(8, 0, true);      // no compression
    lv.setUint16(10, dosTime, true);
    lv.setUint16(12, dosDate, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, data.byteLength, true);
    lv.setUint32(22, data.byteLength, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    new Uint8Array(local, 30).set(nameBytes);

    localParts.push(local, data);

    const central = new ArrayBuffer(46 + nameBytes.length);
    const cv = new DataView(central);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true); // UTF-8 file name
    cv.setUint16(10, 0, true);     // no compression
    cv.setUint16(12, dosTime, true);
    cv.setUint16(14, dosDate, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, data.byteLength, true);
    cv.setUint32(24, data.byteLength, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    new Uint8Array(central, 46).set(nameBytes);

    centralParts.push(central);
    offset += local.byteLength + data.byteLength;
  });

  const centralSize = centralParts.reduce((sum, part) => sum + part.byteLength, 0);
  const centralOffset = offset;
  const fileCount = centralParts.length;

  const end = new ArrayBuffer(22);
  const ev = new DataView(end);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, fileCount, true);
  ev.setUint16(10, fileCount, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, centralOffset, true);
  ev.setUint16(20, 0, true);

  return new Blob([...localParts, ...centralParts, end], { type: 'application/zip' });
}

function exportIndexes(indexArray, zipName, singleTxtWhenOne = false) {
  if (!indexArray.length) return;

  try {
    if (singleTxtWhenOne && indexArray.length === 1) {
      const i = indexArray[0];
      downloadBlob(makeTxtBlob(chunks[i]), getGroupFileName(i));
      return;
    }

    const zipBlob = createZipFromIndexes(indexArray);
    downloadBlob(zipBlob, zipName);
  } catch (err) {
    alert(currentLang === "zh" ? ("导出失败：" + err.message) : ("Export failed: " + err.message));
  }
}

el.exportSelectedTxt.onclick = () => {
  const arr = getSelectedGroupIndexes();
  if (arr.length === 0) {
    alert(i18n[currentLang].select_tip);
    return;
  }
  const zipName = currentLang === "zh" ? "选中号码分组.zip" : "selected-number-groups.zip";
  exportIndexes(arr, zipName, true);
};

el.exportAllTxt.onclick = () => {
  if (!chunks.length) return;
  const indexes = chunks.map((_, i) => i);
  const zipName = currentLang === "zh" ? "号码分组.zip" : "number-groups.zip";
  exportIndexes(indexes, zipName, false);
};

el.shareSelectedTxt.onclick = async () => {
  const arr = getSelectedGroupIndexes();
  if (arr.length === 0) {
    alert(i18n[currentLang].select_tip);
    return;
  }
  await shareMultipleTxt(arr);
};

el.shareAllTxt.onclick = async () => {
  const indexes = chunks.map((_, i) => i);
  await shareMultipleTxt(indexes);
};

async function shareMultipleTxt(indexArray) {
  if (!indexArray.length) return;

  const files = indexArray.map(i => {
    const blob = makeTxtBlob(chunks[i]);
    return new File([blob], getGroupFileName(i), { type: 'text/plain' });
  });

  if (navigator.share && (!navigator.canShare || navigator.canShare({ files })) && files.length > 0) {
    try {
      await navigator.share({
        files,
        title: currentLang === "zh" ? "号码文件" : "Numbers",
        text: files.length + " " + (currentLang === "zh" ? "个文件" : "files")
      });
    } catch (err) {
      console.log('Share canceled or failed', err);
    }
  } else {
    alert(currentLang === "zh" ? "当前浏览器不支持文件分享，已改为下载" : "File sharing is not supported, downloading instead...");
    const zipName = currentLang === "zh" ? "分享号码分组.zip" : "shared-number-groups.zip";
    exportIndexes(indexArray, zipName, true);
  }
}

el.clearBtn.onclick = () => {
  el.numberInput.value = ''; updateStats();
  segmentList = []; selectedGroups.clear();
  updateSegStatus();
  el.resultWrapper.style.display = 'none';
  el.previewTable.innerHTML = '';
};

initFileDrop();
updateStats();
updateI18n();
updateSegStatus();
</script>
</body>
</html>
