// utils/constants.js
const BANGLADESH_LOCATIONS = {
  divisions: [
    'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 
    'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'
  ],

  districts: {
    'Dhaka': [
      'Dhaka', 'Gazipur', 'Narayanganj', 'Manikganj', 
      'Munshiganj', 'Narsingdi', 'Tangail', 'Kishoreganj', 
      'Madaripur', 'Gopalganj', 'Faridpur', 'Rajbari', 'Shariatpur'
    ],
    'Chittagong': [
      'Chittagong', 'Cox\'s Bazar', 'Comilla', 'Feni', 
      'Brahmanbaria', 'Rangamati', 'Noakhali', 'Chandpur', 
      'Lakshmipur', 'Bandarban', 'Khagrachhari'
    ],
    'Rajshahi': [
      'Rajshahi', 'Bogura', 'Pabna', 'Sirajganj', 'Joypurhat', 
      'Chapainawabganj', 'Naogaon', 'Natore'
    ],
    'Khulna': [
      'Khulna', 'Jessore', 'Satkhira', 'Magura', 'Bagerhat', 
      'Chuadanga', 'Kushtia', 'Jhenaidah', 'Narail', 'Meherpur'
    ],
    'Barisal': [
      'Barisal', 'Patuakhali', 'Bhola', 'Pirojpur', 
      'Barguna', 'Jhalokati'
    ],
    'Sylhet': [
      'Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'
    ],
    'Rangpur': [
      'Rangpur', 'Dinajpur', 'Lalmonirhat', 'Nilphamari', 
      'Gaibandha', 'Thakurgaon', 'Panchagarh', 'Kurigram'
    ],
    'Mymensingh': [
      'Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'
    ]
  },

  thanas: {
    // Dhaka Division
    'Dhaka': [
      'Dhanmondi', 'Wari', 'Old Dhaka', 'New Market', 'Ramna', 'Motijheel',
      'Paltan', 'Shahbag', 'Tejgaon', 'Gulshan', 'Banani', 'Uttara',
      'Mirpur', 'Pallabi', 'Shah Ali', 'Cantonment', 'Lalbagh', 'Kotwali',
      'Sutrapur', 'Chawk Bazar', 'Hazaribagh', 'Darus Salam', 'Kafrul',
      'Kalabagan', 'Hatirjheel', 'Badda', 'Vatara', 'Biman Bandar',
      'Khilkhet', 'Turag', 'Dakshinkhan', 'Uttarkhan', 'Sabujbagh',
      'Khilgaon', 'Mugda', 'Jatrabari', 'Kadamtali', 'Gandaria',
      'Islampur', 'Keraniganj', 'Nawabganj', 'Dohar', 'Savar'
    ],
    'Gazipur': [
      'Gazipur Sadar', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj',
      'Tongi', 'Joydebpur'
    ],
    'Narayanganj': [
      'Narayanganj Sadar', 'Bandar', 'Araihazar', 'Sonargaon', 
      'Rupganj', 'Siddhirganj'
    ],
    'Manikganj': [
      'Manikganj Sadar', 'Singair', 'Shibalaya', 'Saturia', 
      'Harirampur', 'Ghior', 'Daulatpur'
    ],
    'Munshiganj': [
      'Munshiganj Sadar', 'Sreenagar', 'Sirajdikhan', 'Louhajang', 
      'Gajaria', 'Tongibari'
    ],
    'Narsingdi': [
      'Narsingdi Sadar', 'Belabo', 'Monohardi', 'Palash', 
      'Raipura', 'Shibpur'
    ],
    'Tangail': [
      'Tangail Sadar', 'Mirzapur', 'Gopalpur', 'Basail', 'Madhupur',
      'Ghatail', 'Kalihati', 'Nagarpur', 'Sakhipur', 'Dhanbari',
      'Delduar', 'Bhuapur'
    ],
    'Kishoreganj': [
      'Kishoreganj Sadar', 'Bajitpur', 'Bhairab', 'Hossainpur',
      'Itna', 'Karimganj', 'Katiadi', 'Kuliarchar', 'Mithamain',
      'Nikli', 'Pakundia', 'Tarail', 'Austagram'
    ],
    'Madaripur': [
      'Madaripur Sadar', 'Kalkini', 'Rajoir', 'Shibchar'
    ],
    'Gopalganj': [
      'Gopalganj Sadar', 'Kashiani', 'Tungipara', 'Kotalipara', 
      'Muksudpur'
    ],
    'Faridpur': [
      'Faridpur Sadar', 'Alfadanga', 'Boalmari', 'Sadarpur',
      'Nagarkanda', 'Bhanga', 'Charbhadrasan', 'Madhukhali', 'Saltha'
    ],
    'Rajbari': [
      'Rajbari Sadar', 'Goalandaghat', 'Pangsha', 'Baliakandi', 
      'Kalukhali'
    ],
    'Shariatpur': [
      'Shariatpur Sadar', 'Naria', 'Zajira', 'Gosairhat', 
      'Bhedarganj', 'Damudya'
    ],

    // Chittagong Division
    'Chittagong': [
      'Kotwali', 'Panchlaish', 'Bayazid Bostami', 'Khulshi', 'Double Mooring',
      'Chawk Bazar', 'Pahartali', 'Bakalia', 'Chandgaon', 'Karnaphuli',
      'Banshkhali', 'Boalkhali', 'Anowara', 'Chandanaish', 'Satkania',
      'Lohagara', 'Hathazari', 'Raozan', 'Rangunia', 'Sandwip',
      'Sitakunda', 'Mirsharai', 'Fatikchhari', 'Patiya'
    ],
    'Cox\'s Bazar': [
      'Cox\'s Bazar Sadar', 'Chakaria', 'Teknaf', 'Ukhia', 
      'Ramu', 'Pekua', 'Kutubdia', 'Maheshkhali'
    ],
    'Comilla': [
      'Comilla Sadar', 'Barura', 'Brahmanpara', 'Chandina', 'Chauddagram',
      'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Meghna',
      'Muradnagar', 'Nangalkot', 'Titas', 'Burichang', 'Lalmai'
    ],
    'Feni': [
      'Feni Sadar', 'Chhagalnaiya', 'Daganbhuiyan', 'Parshuram', 
      'Fulgazi', 'Sonagazi'
    ],
    'Brahmanbaria': [
      'Brahmanbaria Sadar', 'Kasba', 'Nasirnagar', 'Sarail', 
      'Ashuganj', 'Akhaura', 'Nabinagar', 'Bancharampur', 'Bijoynagar'
    ],
    'Rangamati': [
      'Rangamati Sadar', 'Kaptai', 'Kawkhali', 'Baghaichari', 
      'Barkal', 'Langadu', 'Rajasthali', 'Belaichari', 'Juraichari', 'Naniarchar'
    ],
    'Noakhali': [
      'Noakhali Sadar', 'Begumganj', 'Chatkhil', 'Companiganj', 
      'Hatiya', 'Senbagh', 'Sonaimuri', 'Subarnachar', 'Kabirhat'
    ],
    'Chandpur': [
      'Chandpur Sadar', 'Faridganj', 'Haimchar', 'Haziganj', 
      'Kachua', 'Matlab Dakshin', 'Matlab Uttar', 'Shahrasti'
    ],
    'Lakshmipur': [
      'Lakshmipur Sadar', 'Raipur', 'Ramgati', 'Ramganj', 'Kamalnagar'
    ],
    'Bandarban': [
      'Bandarban Sadar', 'Alikadam', 'Naikhongchhari', 'Rowangchhari', 
      'Lama', 'Ruma', 'Thanchi'
    ],
    'Khagrachhari': [
      'Khagrachhari Sadar', 'Dighinala', 'Panchari', 'Lakshmichhari', 
      'Mahalchhari', 'Manikchhari', 'Matiranga', 'Ramgarh', 'Guimara'
    ],

    // Rajshahi Division
    'Rajshahi': [
      'Rajshahi Sadar', 'Bagha', 'Bagmara', 'Charghat', 'Durgapur',
      'Godagari', 'Mohanpur', 'Paba', 'Puthia', 'Tanore'
    ],
    'Bogura': [
      'Bogura Sadar', 'Adamdighi', 'Dhunat', 'Dhupchanchia', 'Gabtali',
      'Kahaloo', 'Nandigram', 'Sariakandi', 'Shajahanpur', 'Sherpur',
      'Shibganj', 'Sonatala'
    ],
    'Pabna': [
      'Pabna Sadar', 'Atgharia', 'Bera', 'Bhangura', 'Chatmohar',
      'Faridpur', 'Ishwardi', 'Santhia', 'Sujanagar'
    ],
    'Sirajganj': [
      'Sirajganj Sadar', 'Belkuchi', 'Chauhali', 'Kamarkhanda', 
      'Kazipur', 'Raiganj', 'Shahjadpur', 'Tarash', 'Ullahpara'
    ],
    'Joypurhat': [
      'Joypurhat Sadar', 'Akkelpur', 'Kalai', 'Khetlal', 'Panchbibi'
    ],
    'Chapainawabganj': [
      'Chapainawabganj Sadar', 'Gomastapur', 'Nachole', 'Bholahat', 'Shibganj'
    ],
    'Naogaon': [
      'Naogaon Sadar', 'Atrai', 'Badalgachhi', 'Dhamoirhat', 'Manda',
      'Mahadebpur', 'Niamatpur', 'Patnitala', 'Porsha', 'Raninagar', 'Sapahar'
    ],
    'Natore': [
      'Natore Sadar', 'Bagatipara', 'Baraigram', 'Gurudaspur', 
      'Lalpur', 'Singra'
    ],

    // Khulna Division
    'Khulna': [
      'Khulna Sadar', 'Batiaghata', 'Dacope', 'Dumuria', 'Dighalia',
      'Koyra', 'Paikgachha', 'Phultala', 'Rupsa', 'Terokhada'
    ],
    'Jessore': [
      'Jessore Sadar', 'Abhaynagar', 'Bagherpara', 'Chaugachha', 'Jhikargachha',
      'Keshabpur', 'Manirampur', 'Sharsha'
    ],
    'Satkhira': [
      'Satkhira Sadar', 'Assasuni', 'Debhata', 'Kalaroa', 'Kaliganj',
      'Shyamnagar', 'Tala'
    ],
    'Magura': [
      'Magura Sadar', 'Mohammadpur', 'Shalikha', 'Sreepur'
    ],
    'Bagerhat': [
      'Bagerhat Sadar', 'Chitalmari', 'Fakirhat', 'Kachua', 'Mollahat',
      'Mongla', 'Morrelganj', 'Rampal', 'Sarankhola'
    ],
    'Chuadanga': [
      'Chuadanga Sadar', 'Alamdanga', 'Damurhuda', 'Jibannagar'
    ],
    'Kushtia': [
      'Kushtia Sadar', 'Bheramara', 'Daulatpur', 'Khoksa', 'Kumarkhali', 'Mirpur'
    ],
    'Jhenaidah': [
      'Jhenaidah Sadar', 'Harinakunda', 'Kaliganj', 'Kotchandpur', 
      'Maheshpur', 'Shailkupa'
    ],
    'Narail': [
      'Narail Sadar', 'Kalia', 'Lohagara'
    ],
    'Meherpur': [
      'Meherpur Sadar', 'Gangni', 'Mujibnagar'
    ],

    // Barisal Division
    'Barisal': [
      'Barisal Sadar', 'Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara',
      'Gaurnadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur'
    ],
    'Patuakhali': [
      'Patuakhali Sadar', 'Bauphal', 'Dashmina', 'Dumki', 'Galachipa',
      'Kalapara', 'Mirzaganj', 'Rangabali'
    ],
    'Bhola': [
      'Bhola Sadar', 'Burhanuddin', 'Char Fasson', 'Daulatkhan', 
      'Lalmohan', 'Manpura', 'Tazumuddin'
    ],
    'Pirojpur': [
      'Pirojpur Sadar', 'Bhandaria', 'Kawkhali', 'Mathbaria', 
      'Nazirpur', 'Nesarabad', 'Zianagar'
    ],
    'Barguna': [
      'Barguna Sadar', 'Amtali', 'Betagi', 'Bamna', 'Pathorghata', 'Taltali'
    ],
    'Jhalokati': [
      'Jhalokati Sadar', 'Kathalia', 'Nalchity', 'Rajapur'
    ],

    // Sylhet Division
    'Sylhet': [
      'Sylhet Sadar', 'Beanibazar', 'Bishwanath', 'Companiganj', 
      'Fenchuganj', 'Golapganj', 'Gowainghat', 'Jaintiapur', 
      'Kanaighat', 'Osmani Nagar', 'Zakiganj', 'Dakshin Surma'
    ],
    'Moulvibazar': [
      'Moulvibazar Sadar', 'Barlekha', 'Juri', 'Kamalganj', 
      'Kulaura', 'Rajnagar', 'Sreemangal'
    ],
    'Habiganj': [
      'Habiganj Sadar', 'Ajmiriganj', 'Bahubal', 'Baniyachong', 
      'Chunarughat', 'Lakhai', 'Madhabpur', 'Nabiganj', 'Shayestaganj'
    ],
    'Sunamganj': [
      'Sunamganj Sadar', 'Bishwamvarpur', 'Chhatak', 'Derai', 
      'Dharampasha', 'Dowarabazar', 'Jagannathpur', 'Jamalganj', 
      'Shalla', 'Sulla', 'Tahirpur'
    ],

    // Rangpur Division
    'Rangpur': [
      'Rangpur Sadar', 'Badarganj', 'Gangachara', 'Kaunia', 
      'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj'
    ],
    'Dinajpur': [
      'Dinajpur Sadar', 'Birampur', 'Birganj', 'Biral', 'Bochaganj',
      'Chirirbandar', 'Fulbari', 'Ghoraghat', 'Hakimpur', 'Kaharole',
      'Khansama', 'Nawabganj', 'Parbatipur'
    ],
    'Lalmonirhat': [
      'Lalmonirhat Sadar', 'Aditmari', 'Hatibandha', 'Kaliganj', 'Patgram'
    ],
    'Nilphamari': [
      'Nilphamari Sadar', 'Dimla', 'Domar', 'Jaldhaka', 'Kishoreganj', 'Saidpur'
    ],
    'Gaibandha': [
      'Gaibandha Sadar', 'Fulchhari', 'Gobindaganj', 'Palashbari', 
      'Sadullapur', 'Saghata', 'Sundarganj'
    ],
    'Thakurgaon': [
      'Thakurgaon Sadar', 'Baliadangi', 'Haripur', 'Pirganj', 'Ranisankail'
    ],
    'Panchagarh': [
      'Panchagarh Sadar', 'Atwari', 'Boda', 'Debiganj', 'Tetulia'
    ],
    'Kurigram': [
      'Kurigram Sadar', 'Bhurungamari', 'Char Rajibpur', 'Chilmari', 
      'Phulbari', 'Nageshwari', 'Rajarhat', 'Raomari', 'Ulipur'
    ],

    // Mymensingh Division
    'Mymensingh': [
      'Mymensingh Sadar', 'Bhaluka', 'Dhobaura', 'Fulbaria', 'Gaffargaon',
      'Gouripur', 'Haluaghat', 'Ishwarganj', 'Muktagachha', 'Nandail',
      'Phulpur', 'Trishal', 'Tara Khanda'
    ],
    'Jamalpur': [
      'Jamalpur Sadar', 'Baksiganj', 'Dewanganj', 'Islampur', 
      'Madarganj', 'Melandaha', 'Sarishabari'
    ],
    'Netrokona': [
      'Netrokona Sadar', 'Atpara', 'Barhatta', 'Durgapur', 'Kalmakanda',
      'Kendua', 'Khaliajuri', 'Madan', 'Mohanganj', 'Purbadhala'
    ],
    'Sherpur': [
      'Sherpur Sadar', 'Jhenaigati', 'Nakla', 'Nalitabari', 'Sreebardi'
    ]
  },

  // Blood groups
  bloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],

  // Helper methods
  getAllDivisions() {
    return this.divisions;
  },

  getDistrictsByDivision(division) {
    return this.districts[division] || [];
  },

  getThanasByDistrict(district) {
    return this.thanas[district] || [];
  },

  getAllDistricts() {
    return Object.values(this.districts).flat();
  },

  getAllThanas() {
    return Object.values(this.thanas).flat();
  },

  validateLocation(division, district, thana = null) {
    if (!this.divisions.includes(division)) {
      return { valid: false, message: 'Invalid division' };
    }
    
    if (!this.districts[division]?.includes(district)) {
      return { valid: false, message: 'Invalid district for the selected division' };
    }
    
    if (thana && !this.thanas[district]?.includes(thana)) {
      return { valid: false, message: 'Invalid thana for the selected district' };
    }
    
    return { valid: true, message: 'Valid location' };
  },

  searchLocation(searchTerm, type = 'all') {
    const term = searchTerm.toLowerCase();
    const results = {
      divisions: [],
      districts: [],
      thanas: []
    };

    if (type === 'all' || type === 'divisions') {
      results.divisions = this.divisions.filter(div => 
        div.toLowerCase().includes(term)
      );
    }

    if (type === 'all' || type === 'districts') {
      results.districts = this.getAllDistricts().filter(dist => 
        dist.toLowerCase().includes(term)
      );
    }

    if (type === 'all' || type === 'thanas') {
      results.thanas = this.getAllThanas().filter(thana => 
        thana.toLowerCase().includes(term)
      );
    }

    return results;
  },

  getLocationHierarchy(division, district = null, thana = null) {
    const hierarchy = { division };
    
    if (district) {
      hierarchy.district = district;
      hierarchy.availableDistricts = this.getDistrictsByDivision(division);
    }
    
    if (thana) {
      hierarchy.thana = thana;
      hierarchy.availableThanas = this.getThanasByDistrict(district);
    }
    
    return hierarchy;
  }
};

module.exports = { BANGLADESH_LOCATIONS };