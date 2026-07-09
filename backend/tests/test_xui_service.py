import unittest

from app.services.xui_service import normalize_client_traffic


class NormalizeClientTrafficTest(unittest.TestCase):
    def test_reads_used_and_limit_from_xui_traffic_fields(self) -> None:
        traffic = normalize_client_traffic(
            {
                "up": 1048576,
                "down": 2097152,
                "total": 1073741824,
                "enable": True,
            }
        )

        self.assertEqual(traffic["traffic_used"], 3145728)
        self.assertEqual(traffic["traffic_limit"], 1073741824)
        self.assertEqual(traffic["status"], "active")

    def test_falls_back_to_total_gb_when_total_is_missing(self) -> None:
        traffic = normalize_client_traffic(
            {
                "up": "1048576",
                "down": "2097152",
                "totalGB": "1073741824",
                "enable": False,
            }
        )

        self.assertEqual(traffic["traffic_used"], 3145728)
        self.assertEqual(traffic["traffic_limit"], 1073741824)
        self.assertEqual(traffic["status"], "disabled")


if __name__ == "__main__":
    unittest.main()
