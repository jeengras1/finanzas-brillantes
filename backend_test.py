import requests
import sys
import json
import time
from datetime import datetime

class FinanzasBrillantesAPITester:
    def __init__(self, base_url="https://libera-finance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def test_health_check(self):
        """Test API health check"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}, Response: {response.text[:100]}"
            self.log_test("Health Check", success, details)
            return success
        except Exception as e:
            self.log_test("Health Check", False, str(e))
            return False

    def test_terminal_execute(self):
        """Test terminal command execution"""
        try:
            # Test simple command
            response = requests.post(
                f"{self.api_url}/terminal/execute",
                json={"command": "echo 'Hello World'"},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                success = "Hello World" in data.get("output", "")
                details = f"Output: {data.get('output', '')[:50]}"
            else:
                success = False
                details = f"Status: {response.status_code}, Response: {response.text[:100]}"
            
            self.log_test("Terminal Execute - Echo", success, details)
            return success
        except Exception as e:
            self.log_test("Terminal Execute - Echo", False, str(e))
            return False

    def test_terminal_error_handling(self):
        """Test terminal error handling"""
        try:
            response = requests.post(
                f"{self.api_url}/terminal/execute",
                json={"command": "nonexistentcommand123"},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                success = data.get("error") is not None
                details = f"Error captured: {data.get('error', '')[:50]}"
            else:
                success = False
                details = f"Status: {response.status_code}"
            
            self.log_test("Terminal Error Handling", success, details)
            return success
        except Exception as e:
            self.log_test("Terminal Error Handling", False, str(e))
            return False

    def test_terminal_history(self):
        """Test terminal history retrieval"""
        try:
            response = requests.get(f"{self.api_url}/terminal/history?limit=5", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Retrieved {len(data)} history items"
            else:
                details = f"Status: {response.status_code}"
            
            self.log_test("Terminal History", success, details)
            return success
        except Exception as e:
            self.log_test("Terminal History", False, str(e))
            return False

    def test_ai_chat(self):
        """Test AI chat functionality"""
        try:
            response = requests.post(
                f"{self.api_url}/ai/chat",
                json={"message": "Hola, ¿cómo estás?", "role": "user"},
                timeout=30  # AI responses can take longer
            )
            
            if response.status_code == 200:
                data = response.json()
                success = len(data.get("response", "")) > 0
                details = f"AI Response length: {len(data.get('response', ''))}"
            else:
                success = False
                details = f"Status: {response.status_code}, Response: {response.text[:100]}"
            
            self.log_test("AI Chat", success, details)
            return success
        except Exception as e:
            self.log_test("AI Chat", False, str(e))
            return False

    def test_ai_history(self):
        """Test AI conversation history"""
        try:
            response = requests.get(f"{self.api_url}/ai/history?limit=5", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Retrieved {len(data)} conversation items"
            else:
                details = f"Status: {response.status_code}"
            
            self.log_test("AI History", success, details)
            return success
        except Exception as e:
            self.log_test("AI History", False, str(e))
            return False

    def test_module_creation(self):
        """Test module creation"""
        try:
            module_data = {
                "name": f"Test Module {int(time.time())}",
                "description": "Test module for API validation",
                "config": {"test": True}
            }
            
            response = requests.post(
                f"{self.api_url}/modules",
                json=module_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                success = data.get("id") is not None
                details = f"Module ID: {data.get('id', '')[:20]}"
                # Store module ID for later tests
                self.test_module_id = data.get("id")
            else:
                success = False
                details = f"Status: {response.status_code}, Response: {response.text[:100]}"
            
            self.log_test("Module Creation", success, details)
            return success
        except Exception as e:
            self.log_test("Module Creation", False, str(e))
            return False

    def test_module_list(self):
        """Test module listing"""
        try:
            response = requests.get(f"{self.api_url}/modules", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Retrieved {len(data)} modules"
            else:
                details = f"Status: {response.status_code}"
            
            self.log_test("Module List", success, details)
            return success
        except Exception as e:
            self.log_test("Module List", False, str(e))
            return False

    def test_module_update(self):
        """Test module status update"""
        if not hasattr(self, 'test_module_id'):
            self.log_test("Module Update", False, "No module ID available from creation test")
            return False
        
        try:
            response = requests.patch(
                f"{self.api_url}/modules/{self.test_module_id}",
                params={"status": "active"},
                timeout=10
            )
            
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            self.log_test("Module Update", success, details)
            return success
        except Exception as e:
            self.log_test("Module Update", False, str(e))
            return False

    def test_module_deletion(self):
        """Test module deletion"""
        if not hasattr(self, 'test_module_id'):
            self.log_test("Module Deletion", False, "No module ID available from creation test")
            return False
        
        try:
            response = requests.delete(
                f"{self.api_url}/modules/{self.test_module_id}",
                timeout=10
            )
            
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            self.log_test("Module Deletion", success, details)
            return success
        except Exception as e:
            self.log_test("Module Deletion", False, str(e))
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Finanzas Brillantes API Tests")
        print(f"🔗 Testing API at: {self.api_url}")
        print("=" * 50)
        
        # Core API tests
        self.test_health_check()
        
        # Terminal tests
        self.test_terminal_execute()
        self.test_terminal_error_handling()
        self.test_terminal_history()
        
        # AI tests
        print("\n🤖 Testing AI functionality (may take longer)...")
        self.test_ai_chat()
        self.test_ai_history()
        
        # Module tests
        print("\n📦 Testing Module functionality...")
        self.test_module_creation()
        self.test_module_list()
        self.test_module_update()
        self.test_module_deletion()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed. Check details above.")
            return 1

def main():
    tester = FinanzasBrillantesAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())