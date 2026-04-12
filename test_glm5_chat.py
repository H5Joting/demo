"""
测试 GLM-5 AI 对话功能
"""
from playwright.sync_api import sync_playwright
import time

def test_glm5_chat():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # 监听控制台日志
        page.on('console', lambda msg: print(f'[Browser Console] {msg.type}: {msg.text}'))
        
        # 监听网络请求
        def handle_response(response):
            if '/api/ai/chat' in response.url:
                print(f'[API Response] {response.url}')
                print(f'Status: {response.status}')
                try:
                    body = response.json()
                    print(f'Body: {body}')
                except:
                    pass
        
        page.on('response', handle_response)
        
        print('1. 导航到报表列表页面...')
        page.goto('http://localhost:3003/')
        page.wait_for_load_state('networkidle')
        
        print('2. 点击第一个报表卡片进入详情页...')
        # 找到第一个报表卡片并点击
        cards = page.locator('[class*="card"]').all()
        if cards:
            cards[0].click()
            page.wait_for_load_state('networkidle')
            time.sleep(2)
        else:
            print('未找到报表卡片')
            browser.close()
            return
        
        print('3. 进入配置模式...')
        # 点击配置按钮
        config_btn = page.locator('button:has-text("配置")')
        if config_btn.count() > 0:
            config_btn.click()
            time.sleep(1)
        else:
            print('未找到配置按钮')
            browser.close()
            return
        
        print('4. 选择一个非固定的面板...')
        # 找到可编辑的面板并点击选中
        panels = page.locator('[class*="section"]:not([class*="fixed"])').all()
        if len(panels) > 1:
            # 选择中间的面板（非第一个和最后一个）
            panels[1].click()
            time.sleep(1)
            print(f'已选中面板')
        else:
            print('未找到可编辑面板')
        
        print('5. 发送消息到 AI 对话...')
        # 找到输入框并输入消息
        textarea = page.locator('textarea')
        if textarea.count() > 0:
            textarea.fill('将标题改为 测试标题')
            time.sleep(0.5)
            
            # 点击发送按钮
            send_btn = page.locator('button:has-text("")').filter(has=page.locator('svg')).last()
            if send_btn.count() > 0:
                send_btn.click()
                print('消息已发送，等待响应...')
                time.sleep(3)
            else:
                # 尝试按 Enter 发送
                textarea.press('Enter')
                print('消息已发送 (Enter)，等待响应...')
                time.sleep(3)
        else:
            print('未找到输入框')
        
        print('6. 截图保存结果...')
        page.screenshot(path='/tmp/glm5_test_result.png', full_page=True)
        
        print('7. 获取对话消息...')
        messages = page.locator('[class*="message"]').all()
        print(f'找到 {len(messages)} 条消息')
        for i, msg in enumerate(messages):
            try:
                text = msg.text_content()
                print(f'消息 {i+1}: {text[:100]}...' if len(text) > 100 else f'消息 {i+1}: {text}')
            except:
                pass
        
        browser.close()
        print('测试完成!')

if __name__ == '__main__':
    test_glm5_chat()
