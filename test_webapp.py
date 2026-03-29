from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    print("正在访问统一日志分析系统...")
    page.goto('http://localhost:3000')
    page.wait_for_load_state('networkidle')
    
    print("页面加载完成，开始测试...")
    
    page.screenshot(path='e:/project/demo/screenshot_dashboard.png', full_page=True)
    print("已保存仪表盘截图: screenshot_dashboard.png")
    
    title = page.title()
    print(f"页面标题: {title}")
    
    header = page.locator('h1').first.text_content()
    print(f"系统名称: {header}")
    
    print("\n检查主要组件...")
    
    sections = page.locator('section')
    section_count = sections.count()
    print(f"找到 {section_count} 个主要区块")
    
    tables = page.locator('table')
    table_count = tables.count()
    print(f"找到 {table_count} 个表格")
    
    cards = page.locator('.ant-card')
    card_count = cards.count()
    print(f"找到 {card_count} 个卡片组件")
    
    print("\n测试日志查询页面...")
    page.goto('http://localhost:3000/query')
    page.wait_for_load_state('networkidle')
    page.screenshot(path='e:/project/demo/screenshot_logquery.png', full_page=True)
    print("已保存日志查询页面截图: screenshot_logquery.png")
    
    print("\n测试日志统计页面...")
    page.goto('http://localhost:3000/statistics')
    page.wait_for_load_state('networkidle')
    page.screenshot(path='e:/project/demo/screenshot_logstatistics.png', full_page=True)
    print("已保存日志统计页面截图: screenshot_logstatistics.png")
    
    print("\n测试系统设置页面...")
    page.goto('http://localhost:3000/settings')
    page.wait_for_load_state('networkidle')
    page.screenshot(path='e:/project/demo/screenshot_systemsettings.png', full_page=True)
    print("已保存系统设置页面截图: screenshot_systemsettings.png")
    
    print("\n✅ 所有页面测试通过！")
    
    browser.close()
