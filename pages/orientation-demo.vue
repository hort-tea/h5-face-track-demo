<template>
  <div class="orientation-demo">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <h2>横屏适配演示</h2>
      <div class="mode-selector">
        <select v-model="currentMode" @change="changeMode">
          <option value="responsive">响应式布局</option>
          <option value="warning">横屏警告</option>
          <option value="rotate">旋转适配</option>
          <option value="force-portrait">强制竖屏</option>
        </select>
      </div>
    </div>

    <!-- 使用OrientationAdapter组件 -->
    <OrientationAdapter :mode="currentMode" :show-warning="showWarning">
      <div class="demo-content" :class="contentLayoutClass">
        <!-- 主要内容区域 -->
        <div class="main-content">
          <div class="content-card">
            <h3>主要内容区域</h3>
            <p>当前适配模式: <strong>{{ currentMode }}</strong></p>
            <p>屏幕方向: <strong>{{ orientation }}</strong></p>
            
            <!-- 示例表单 -->
            <div class="form-layout">
              <div class="form-item">
                <label>姓名:</label>
                <input type="text" placeholder="请输入姓名" />
              </div>
              <div class="form-item">
                <label>电话:</label>
                <input type="tel" placeholder="请输入电话" />
              </div>
              <div class="form-item form-item-full">
                <label>地址:</label>
                <textarea placeholder="请输入详细地址"></textarea>
              </div>
            </div>
            
            <!-- 示例图片 -->
            <div class="image-container">
              <div class="responsive-image placeholder-image">
                📷 示例图片区域
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏内容 -->
        <div class="sidebar-content">
          <div class="content-card">
            <h3>侧边栏</h3>
            
            <!-- 功能按钮组 -->
            <div class="button-group">
              <button class="demo-button primary">主要操作</button>
              <button class="demo-button secondary">次要操作</button>
              <button class="demo-button">其他操作</button>
            </div>
            
            <!-- 信息卡片 -->
            <div class="info-cards">
              <div class="info-card">
                <h4>信息1</h4>
                <p>这是一些示例信息内容</p>
              </div>
              <div class="info-card">
                <h4>信息2</h4>
                <p>横屏时布局会自动调整</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OrientationAdapter>

    <!-- 固定底部按钮 -->
    <div class="fixed-bottom">
      <button @click="toggleWarning" class="toggle-button">
        {{ showWarning ? '关闭' : '开启' }}横屏警告
      </button>
    </div>

    <!-- 方向指示器 -->
    <div class="orientation-indicator" :class="orientationClass">
      <div class="indicator-icon">{{ orientationIcon }}</div>
      <div class="indicator-text">{{ orientation }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

// 响应式数据
const currentMode = ref('responsive')
const showWarning = ref(true)
const isLandscape = ref(false)

// 计算属性
const orientation = computed(() => isLandscape.value ? '横屏' : '竖屏')
const orientationIcon = computed(() => isLandscape.value ? '📱' : '📱')
const orientationClass = computed(() => isLandscape.value ? 'landscape' : 'portrait')

const contentLayoutClass = computed(() => {
  switch (currentMode.value) {
    case 'responsive':
      return 'responsive-layout'
    case 'force-portrait':
      return 'force-portrait'
    default:
      return 'default-layout'
  }
})

// 方法
const changeMode = () => {
  console.log('切换适配模式:', currentMode.value)
}

const toggleWarning = () => {
  showWarning.value = !showWarning.value
}

const checkOrientation = () => {
  const orientation = screen.orientation?.angle || window.orientation || 0
  isLandscape.value = Math.abs(orientation) === 90
}

const handleOrientationChange = () => {
  setTimeout(checkOrientation, 100)
}

// 生命周期
onMounted(() => {
  checkOrientation()
  window.addEventListener('orientationchange', handleOrientationChange)
  window.addEventListener('resize', handleOrientationChange)
  
  if (screen.orientation) {
    screen.orientation.addEventListener('change', checkOrientation)
  }
})

onUnmounted(() => {
  window.removeEventListener('orientationchange', handleOrientationChange)
  window.removeEventListener('resize', handleOrientationChange)
  
  if (screen.orientation) {
    screen.orientation.removeEventListener('change', checkOrientation)
  }
})
</script>

<style scoped>
/* 导入横屏适配CSS */
@import '~/assets/css/orientation.css';

.orientation-demo {
  min-height: 100vh;
  background: #f5f5f5;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-bar h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.mode-selector select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 14px;
}

.demo-content {
  padding: 20px;
  gap: 20px;
}

.default-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-content {
  flex: 2;
}

.sidebar-content {
  flex: 1;
}

.content-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 16px;
}

.content-card h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
}

.content-card p {
  margin: 8px 0;
  color: #666;
  line-height: 1.5;
}

/* 表单样式 */
.form-item {
  margin-bottom: 16px;
}

.form-item label {
  display: block;
  margin-bottom: 4px;
  color: #333;
  font-size: 14px;
}

.form-item input,
.form-item textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-item textarea {
  height: 80px;
  resize: vertical;
}

/* 图片容器 */
.image-container {
  margin: 20px 0;
}

.placeholder-image {
  background: #f0f0f0;
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  color: #999;
  font-size: 16px;
}

/* 按钮样式 */
.demo-button {
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.demo-button.primary {
  background: #007AFF;
  color: white;
}

.demo-button.secondary {
  background: #34C759;
  color: white;
}

.demo-button:not(.primary):not(.secondary) {
  background: #f0f0f0;
  color: #333;
}

.demo-button:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

/* 信息卡片 */
.info-cards {
  margin-top: 16px;
}

.info-card {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
  border-left: 3px solid #007AFF;
}

.info-card h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #333;
}

.info-card p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

/* 切换按钮 */
.toggle-button {
  background: #FF3B30;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(255, 59, 48, 0.3);
  transition: all 0.2s;
}

.toggle-button:hover {
  background: #D70015;
  transform: translateY(-1px);
}

/* 方向指示器 */
.orientation-indicator {
  position: fixed;
  top: 80px;
  right: 16px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 16px;
  font-size: 12px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 4px;
}

.indicator-icon {
  font-size: 14px;
  transform: rotate(0deg);
  transition: transform 0.3s;
}

.orientation-indicator.landscape .indicator-icon {
  transform: rotate(90deg);
}

/* 横屏时的特殊样式 */
@media screen and (orientation: landscape) {
  .nav-bar {
    padding: 8px 16px;
  }
  
  .nav-bar h2 {
    font-size: 16px;
  }
  
  .demo-content {
    padding: 10px;
    height: calc(100vh - 50px);
    overflow-y: auto;
  }
  
  .content-card {
    padding: 15px;
    margin-bottom: 10px;
  }
  
  .form-item {
    margin-bottom: 12px;
  }
  
  .placeholder-image {
    padding: 20px;
    font-size: 14px;
  }
  
  .orientation-indicator {
    top: 60px;
    right: 10px;
  }
}
</style>