"""
Web Scraper Amélioré pour Yelo.ma - Salons de Coiffure et Beauté
Version corrigée avec meilleure extraction des données
"""

import requests
from bs4 import BeautifulSoup
import csv
import time
import re
from urllib.parse import urljoin
import os

class YeloScraperImproved:
    def __init__(self):
        self.base_url = "https://www.yelo.ma"
        self.category_url = "https://www.yelo.ma/category/salons_de_coiffure_et_de_beaut%C3%A9"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
        }
        self.salons_data = []
        self.session = requests.Session()
    
    def get_page(self, url):
        """Fetch page content with better error handling"""
        try:
            response = self.session.get(url, headers=self.headers, timeout=15)
            response.raise_for_status()
            response.encoding = 'utf-8'  # Force UTF-8 encoding
            return BeautifulSoup(response.content, 'html.parser')
        except requests.RequestException as e:
            print(f"❌ Error fetching {url}: {e}")
            return None
    
    def clean_text(self, text):
        """Clean and normalize text"""
        if not text:
            return ''
        # Remove extra whitespace
        text = ' '.join(text.split())
        # Fix encoding issues
        text = text.encode('latin1').decode('utf-8', errors='ignore')
        return text.strip()
    
    def extract_salon_links(self, soup):
        """Extract all salon profile links - IMPROVED"""
        salon_links = []
        
        # Method 1: Look for "Voir le Profil" buttons
        profile_buttons = soup.find_all('a', text=re.compile(r'Voir.*Profil', re.I))
        for btn in profile_buttons:
            if btn.get('href'):
                full_url = urljoin(self.base_url, btn['href'])
                salon_links.append(full_url)
        
        # Method 2: Look for links in salon cards
        salon_cards = soup.find_all('div', class_=re.compile(r'company|salon|listing', re.I))
        for card in salon_cards:
            links = card.find_all('a', href=True)
            for link in links:
                href = link['href']
                if '/company/' in href or '/profile/' in href:
                    full_url = urljoin(self.base_url, href)
                    salon_links.append(full_url)
        
        # Method 3: Direct search for company links
        all_links = soup.find_all('a', href=re.compile(r'/company/\d+'))
        for link in all_links:
            full_url = urljoin(self.base_url, link['href'])
            salon_links.append(full_url)
        
        # Remove duplicates and return
        unique_links = list(set(salon_links))
        print(f"  Found {len(unique_links)} unique salon links")
        return unique_links
    
    def extract_salon_details(self, url):
        """Extract salon details - IMPROVED with better selectors"""
        print(f"  🔍 Scraping: {url.split('/')[-1]}")
        soup = self.get_page(url)
        
        if not soup:
            return None
        
        salon = {
            'name': '',
            'address': '',
            'phone': '',
            'email': '',
            'website': '',
            'working_hours': '',
            'image_url': '',
            'profile_url': url
        }
        
        # Extract Name - IMPROVED
        name_elem = (
            soup.find('h1') or 
            soup.find('h1', class_=re.compile(r'company|business|salon', re.I)) or
            soup.find(class_=re.compile(r'company.*name|business.*name', re.I))
        )
        if name_elem:
            salon['name'] = self.clean_text(name_elem.get_text())
        
        # Extract Address - IMPROVED
        # Look for address in specific tags
        address_keywords = ['Adresse', 'Address', 'adresse']
        for keyword in address_keywords:
            addr_label = soup.find(text=re.compile(keyword, re.I))
            if addr_label:
                # Get next sibling or parent's text
                parent = addr_label.find_parent()
                if parent:
                    addr_text = parent.get_text(strip=True)
                    # Remove the label itself
                    addr_text = re.sub(r'Adresse\s*:?\s*', '', addr_text, flags=re.I)
                    if addr_text and len(addr_text) > 5:
                        salon['address'] = self.clean_text(addr_text)
                        break
        
        # Alternative: Look for street patterns
        if not salon['address']:
            address_patterns = soup.find_all(text=re.compile(r'\d+.*(?:Rue|Avenue|Boulevard|Bd|Av)', re.I))
            if address_patterns:
                salon['address'] = self.clean_text(address_patterns[0])
        
        # Extract Phone - IMPROVED
        phone_elem = soup.find('a', href=re.compile(r'tel:'))
        if phone_elem:
            phone_raw = phone_elem.get('href', '').replace('tel:', '')
            salon['phone'] = self.clean_text(phone_raw)
        else:
            # Look for phone in text
            phone_label = soup.find(text=re.compile(r'Téléphone|Phone|Tel', re.I))
            if phone_label:
                parent = phone_label.find_parent()
                if parent:
                    phone_text = parent.get_text()
                    phone_match = re.search(r'0\d{9}|\d{4}[-\s]?\d{6}', phone_text)
                    if phone_match:
                        salon['phone'] = phone_match.group().replace(' ', '').replace('-', '')
        
        # Extract Email - IMPROVED
        email_elem = soup.find('a', href=re.compile(r'mailto:'))
        if email_elem:
            salon['email'] = email_elem['href'].replace('mailto:', '').strip()
        else:
            # Search for email pattern in text
            email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
            emails = soup.find_all(text=re.compile(email_pattern))
            if emails:
                email_match = re.search(email_pattern, str(emails[0]))
                if email_match:
                    salon['email'] = email_match.group()
        
        # Extract Website - IMPROVED
        website_keywords = ['Site Web', 'Website', 'site web']
        for keyword in website_keywords:
            web_elem = soup.find('a', text=re.compile(keyword, re.I))
            if web_elem and web_elem.get('href'):
                href = web_elem['href']
                if href.startswith('http'):
                    salon['website'] = href
                    break
        
        # Extract Working Hours - IMPROVED
        hours_text = []
        
        # Method 1: Find "Heures de travail" section
        hours_header = soup.find(text=re.compile(r'Heures?\s+de\s+travail|Horaires?', re.I))
        if hours_header:
            container = hours_header.find_parent()
            if container:
                # Get all text after the header
                siblings = container.find_next_siblings(limit=7)
                for sibling in siblings:
                    text = sibling.get_text(strip=True)
                    # Check if it's a day entry
                    if any(day in text for day in ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']):
                        hours_text.append(text)
        
        # Method 2: Find divs with time patterns
        if not hours_text:
            time_divs = soup.find_all(text=re.compile(r'\d{1,2}:\d{2}\s*(?:am|pm)?', re.I))
            for div in time_divs[:7]:  # Max 7 days
                parent_text = div.find_parent().get_text(strip=True)
                if any(day in parent_text for day in ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']):
                    hours_text.append(parent_text)
        
        if hours_text:
            # Clean and format hours
            salon['working_hours'] = ' | '.join([self.clean_text(h) for h in hours_text])
        
        # Extract Image - IMPROVED
        # Priority 1: Look for main salon image
        img_elem = (
            soup.find('img', class_=re.compile(r'company.*image|salon.*image|profile.*image', re.I)) or
            soup.find('img', alt=re.compile(r'logo|salon|company', re.I)) or
            soup.find('div', class_=re.compile(r'logo|image', re.I)).find('img') if soup.find('div', class_=re.compile(r'logo|image', re.I)) else None
        )
        
        # Priority 2: Get first non-icon image
        if not img_elem:
            all_images = soup.find_all('img')
            for img in all_images:
                src = img.get('src', '') or img.get('data-src', '')
                # Skip icons, logos, banners
                if src and not any(x in src.lower() for x in ['icon', 'sprite', 'banner', 'ad', 'logo-']):
                    img_elem = img
                    break
        
        if img_elem:
            img_src = img_elem.get('src') or img_elem.get('data-src') or img_elem.get('data-lazy')
            if img_src:
                # Handle relative URLs
                if img_src.startswith('//'):
                    img_src = 'https:' + img_src
                elif img_src.startswith('/'):
                    img_src = urljoin(self.base_url, img_src)
                
                # Clean base64 images (too long for CSV)
                if 'base64' not in img_src:
                    salon['image_url'] = img_src
                else:
                    salon['image_url'] = '[Base64 Image - Too Long]'
        
        return salon
    
    def scrape_all_salons(self, max_pages=5):
        """Scrape all salons from multiple pages"""
        print("🚀 Starting scraping...")
        print(f"Target: {max_pages} pages\n")
        
        for page_num in range(1, max_pages + 1):
            print(f"\n📄 Page {page_num}/{max_pages}")
            print("=" * 50)
            
            # Construct URL
            if page_num == 1:
                page_url = self.category_url
            else:
                page_url = f"{self.category_url}?page={page_num}"
            
            soup = self.get_page(page_url)
            if not soup:
                print(f"❌ Failed to load page {page_num}, stopping.")
                break
            
            # Extract links
            salon_links = self.extract_salon_links(soup)
            
            if not salon_links:
                print("  No salons found on this page. Stopping.")
                break
            
            # Scrape each salon
            for idx, link in enumerate(salon_links, 1):
                print(f"  [{idx}/{len(salon_links)}]", end=" ")
                salon_data = self.extract_salon_details(link)
                
                if salon_data and salon_data['name']:
                    self.salons_data.append(salon_data)
                    print(f"✅ {salon_data['name'][:50]}")
                else:
                    print(f"⚠️  Failed to extract data")
                
                # Respectful delay
                time.sleep(1.5)
            
            # Delay between pages
            time.sleep(3)
        
        print(f"\n{'=' * 50}")
        print(f"✅ Scraping completed!")
        print(f"📊 Total salons scraped: {len(self.salons_data)}")
    
    def save_to_csv(self, filename='salons_maroc_clean.csv'):
        """Save data to CSV with proper encoding"""
        if not self.salons_data:
            print("❌ No data to save!")
            return
        
        fieldnames = ['name', 'address', 'phone', 'email', 'website', 
                      'working_hours', 'image_url', 'profile_url']
        
        try:
            with open(filename, 'w', newline='', encoding='utf-8-sig') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(self.salons_data)
            
            print(f"\n✅ Data saved to {filename}")
            print(f"📊 Total records: {len(self.salons_data)}")
            print(f"📁 File size: {os.path.getsize(filename) / 1024:.2f} KB")
            
        except Exception as e:
            print(f"❌ Error saving CSV: {e}")


def main():
    """Main execution with user options"""
    print("=" * 60)
    print("  YELO.MA SALON SCRAPER - IMPROVED VERSION")
    print("=" * 60)
    print()
    
    # Get user input
    try:
        max_pages = int(input("How many pages to scrape? (1-10): ") or "3")
        max_pages = min(max(1, max_pages), 10)  # Limit between 1-10
    except:
        max_pages = 3
    
    print(f"\n📋 Configuration:")
    print(f"  - Pages to scrape: {max_pages}")
    print(f"  - Output file: salons_maroc_clean.csv")
    print()
    
    input("Press ENTER to start scraping...")
    print()
    
    # Run scraper
    scraper = YeloScraperImproved()
    scraper.scrape_all_salons(max_pages=max_pages)
    scraper.save_to_csv('salons_maroc_clean3.csv')
    
    print("\n" + "=" * 60)
    print("  ✅ SCRAPING COMPLETED!")
    print("=" * 60)


if __name__ == "__main__":
    main()