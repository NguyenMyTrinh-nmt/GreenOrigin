// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;
contract AgroTraceability {
    // ================================
    // 1. KHAI BÁO CẤU TRÚC DỮ LIỆU
    // ================================

    // Struct Trace dùng để lưu 1 bước trong quá trình truy xuất nguồn gốc
    struct Trace {
        string action;        // Hành động: Thu hoạch, Đóng gói, Vận chuyển,...
        string location;      // Địa điểm thực hiện
        uint256 timestamp;    // Thời gian (lấy từ blockchain)
        address actor;        // Địa chỉ ví người thực hiện hành động
    }

    // Struct Product dùng để lưu thông tin sản phẩm nông sản
    struct Product {
        string productId;     // Mã sản phẩm (ví dụ: SP001)
        string name;          // Tên nông sản (Gạo, Cà phê, Xoài,...)
        string farm;          // Tên nông trại / nơi sản xuất
        uint256 createdAt;    // Thời gian tạo sản phẩm
        Trace[] traces;       // Danh sách các bước truy xuất nguồn gốc
    }

    // ================================
    // 2. KHAI BÁO BIẾN LƯU TRỮ
    // ================================

    // Mapping lưu sản phẩm theo productId
    // productId => Product
    mapping(string => Product) private products;

    // Mapping kiểm tra sản phẩm đã tồn tại hay chưa
    mapping(string => bool) private productExists;

    // ================================
    // 3. HÀM THÊM SẢN PHẨM MỚI
    // ================================

    function addProduct(
        string memory _productId, // Mã sản phẩm
        string memory _name,      // Tên nông sản
        string memory _farm       // Nông trại
    ) public {
        // Kiểm tra sản phẩm chưa tồn tại
        require(!productExists[_productId], "Product already exists");

        // Lấy tham chiếu đến sản phẩm trong storage
        Product storage p = products[_productId];

        // Gán thông tin cho sản phẩm
        p.productId = _productId;
        p.name = _name;
        p.farm = _farm;
        p.createdAt = block.timestamp; // Thời gian hiện tại của blockchain

        // Đánh dấu sản phẩm đã tồn tại
        productExists[_productId] = true;
    }

    // ================================
    // 4. HÀM THÊM BƯỚC TRUY XUẤT
    // ================================

    function addTrace(
        string memory _productId, // Mã sản phẩm
        string memory _action,    // Hành động
        string memory _location   // Địa điểm
    ) public {
        // Kiểm tra sản phẩm có tồn tại không
        require(productExists[_productId], "Product not found");

        // Thêm một bước truy xuất mới vào mảng traces
        products[_productId].traces.push(
            Trace({
                action: _action,           // Hành động
                location: _location,       // Địa điểm
                timestamp: block.timestamp,// Thời gian blockchain
                actor: msg.sender          // Người gọi hàm
            })
        );
    }

    // ================================
    // 5. HÀM LẤY THÔNG TIN SẢN PHẨM
    // ================================

    function getProduct(
        string memory _productId // Mã sản phẩm
    )
        public
        view
        returns (
            string memory, // productId
            string memory, // name
            string memory, // farm
            uint256,       // createdAt
            uint256        // số bước truy xuất
        )
    {
        // Kiểm tra sản phẩm tồn tại
        require(productExists[_productId], "Product not found");

        // Lấy sản phẩm từ storage
        Product storage p = products[_productId];

        // Trả về thông tin cơ bản
        return (
            p.productId,
            p.name,
            p.farm,
            p.createdAt,
            p.traces.length
        );
    }

    // ================================
    // 6. HÀM LẤY CHI TIẾT 1 BƯỚC TRUY XUẤT
    // ================================

    function getTrace(
        string memory _productId, // Mã sản phẩm
        uint256 _index            // Vị trí bước truy xuất
    )
        public
        view
        returns (
            string memory, // action
            string memory, // location
            uint256,       // timestamp
            address        // actor
        )
    {
        // Kiểm tra sản phẩm tồn tại
        require(productExists[_productId], "Product not found");

        // Lấy bước truy xuất theo index
        Trace storage t = products[_productId].traces[_index];

        // Trả về chi tiết bước truy xuất
        return (
            t.action,
            t.location,
            t.timestamp,
            t.actor
        );
    }
}