/* Duy Minh */
/* // Tạo function constructor Staff */
function Staff(
  account,
  name,
  email,
  password,
  datewword,
  basicsalary,
  position,
  time
) {
  this.account = account;
  this.name = name;
  this.email = email;
  this.password = password;
  this.datewword = datewword;
  this.basicsalary = basicsalary;
  this.position = position;
  this.time = time;
}
// Function Dom
function dom(selector) {
  return document.querySelector(selector);
}

Staff.prototype.totalsalary = function () {
  let currentFormat = new Intl.NumberFormat("vn-VN");
  if (this.position == "Sếp") {
    return currentFormat.format(this.basicsalary * 3);
  } else if (this.position == "Trưởng Phòng") {
    return currentFormat.format(this.basicsalary * 2);
  } else if (this.position == "Nhân Viên") {
    return currentFormat.format(this.basicsalary * 1);
  }
};

Staff.prototype.rank = function () {
  if (this.time >= 192) {
    return "Nhân Viên Xuất Sắc";
  } else if (this.time >= 176) {
    return "Nhân Viên Giỏi";
  } else if (this.time >= 160) {
    return "Nhân Viên Khá";
  } else {
    return "Nhân Viên Trung Bình";
  }
};

/* Tạo array staffs để lưu trữ danh sách nhân viên */
let staffs = [];
/* Hàm init sẽ được thực thi khi chương trình được khởi chạy */
init();
/////////////////////////////////////////////////////////////////////////////////////////////

function init() {
  staffs = JSON.parse(localStorage.getItem("staffs")) || [];

  staffs = staffs.map((staff) => {
    return new Staff(
      staff.account,
      staff.name,
      staff.email,
      staff.password,
      staff.datewword,
      staff.basicsalary,
      staff.position,
      staff.time
    );
  });
  console.log("Staff sau khi map", staffs);
  display(staffs);
}

function AddStaff() {
  /* 1: Dom Thông tin từ cách input */
  let account = dom("#tknv").value;
  let name = dom("#name").value;
  let email = dom("#email").value;
  let password = dom("#password").value;
  let datewword = dom("#datepicker").value;
  let basicsalary = +dom("#luongCB").value;
  let position = dom("#chucvu").value;
  let time = dom("#gioLam").value;

  let isValid = validateForm();
  /* Kiểm tra nếu form không hợp lệ => Kết thúc hàm */
  if (!isValid) {
    return;
  }

 
  /* 2: Tạo object member chứa các thông tin trên */
  let staff = new Staff(
    account,
    name,
    email,
    password,
    datewword,
    basicsalary,
    position,
    time
  );
  console.log(staff);
  /* 3: Hiển thị thông tin của staff vừa thêm ra table */
  staffs.push(staff);
  localStorage.setItem("staffs", JSON.stringify(staffs));
  /* 4: Hiển thị thông tin */
  display(staffs);
  /* 5: Reset Form */
  resetForm();
}
/* Hiển thị thông tin */
function display(staffs) {
  let html = staffs.reduce((result, staff) => {
    return (result += `
      <tr>
      <td>${staff.account} </td>
      <td>${staff.name} </td>
      <td>${staff.email} </td>
      <td>${staff.datewword} </td>
      <td>${staff.position} </td>
      <td>${staff.totalsalary()}</td>
      <td> ${staff.rank()}</td>
      <td><button class="btn btn-danger" onclick="DeleteStaff('${
        staff.account
      }')">Delete</button></td>
      <td><button class="btn btn-warning" data-toggle="modal"
      data-target="#myModal" onclick="selectStaff('${
        staff.account
      }')">Edit</button></td>
      </tr>
      `);
  }, "");
  /* Dom tới thẻ tbody và gán chuỗi html vừa tạo */
  dom("#tableDanhSach").innerHTML = html;
}

/* Cập Nhật thông tin nhân viên */
function uploadStaff() {
  let account = dom("#tknv").value;
  let name = dom("#name").value;
  let email = dom("#email").value;
  let password = dom("#password").value;
  let datewword = dom("#datepicker").value;
  let basicsalary = +dom("#luongCB").value;
  let position = dom("#chucvu").value;
  let time = dom("#gioLam").value;

  let isValid = validateName() &
  validateEmail() &
  validatePassword() &
  validateWord() &
  validateSalary() &
  validatePosition() &
  validateTime();
  if (!isValid) {
    return;
  }

  let staff = new Staff(
    account,
    name,
    email,
    password,
    datewword,
    basicsalary,
    position,
    time
  );

  let index = staffs.findIndex((value) => value.account === staff.account);
  staffs[index] = staff;

  localStorage.setItem("staffs", JSON.stringify(staffs));

  display(staffs);

  resetForm();
}
/* Xóa Nhân Viên */
function DeleteStaff(staffId) {
  staffs = staffs.filter((staff) => {
    return staff.account !== staffId;
  });
  localStorage.setItem("staffs", JSON.stringify(staffs));
  display(staffs);
}
/* Tìm Kiếm Nhân Viên */
function SearchStaff() {
  let searchValue = dom("#searchName").value;

  if (!searchValue) {
    display(staffs);
    return;
  }
  searchValue = searchValue.toLowerCase();
  let NewStaff = staffs.filter((staff) => {
    let rank = staff.rank().toLowerCase();
    return rank.includes(searchValue);
  });
  display(NewStaff);
}
/* Edit - Chỉnh sửa */
function selectStaff(staffId) {
  let staff = staffs.find((staff) => {
    return staff.account === staffId;
  });
  if (!staff) {
    return;
  }

  dom("#tknv").value = staff.account;
  dom("#name").value = staff.name;
  dom("#email").value = staff.email;
  dom("#password").value = staff.password;
  dom("#datepicker").value = staff.datewword;
  dom("#luongCB").value = staff.basicsalary;
  dom("#chucvu").value = staff.position;
  dom("#gioLam").value = staff.time;

  dom("#tknv").disabled = true;
  dom("#btnThemNV").disabled = true;
  dom("#btnCapNhat").disabled = false;
}
/* Hàm Reset */
function resetForm() {
  dom("#tknv").value = "";
  dom("#name").value = "";
  dom("#email").value = "";
  dom("#password").value = "";
  dom("#datepicker").value = "";
  dom("#luongCB").value = 0;
  dom("#chucvu").value = "";
  dom("#gioLam").value = 0;

  dom("#tknv").disabled = false;
  dom("#btnThemNV").disabled = false;
  dom("#btnCapNhat").disabled = true;
}

/////////////////////////////////////////////////////////////////////////////
/* Validate Tài khoản */
function validateId() {
  let account = dom("#tknv").value;
  let spanEl = dom("#tbTKNV");

  if (!account) {
    spanEl.style.display = "Block";
    spanEl.innerHTML = "Tài Khoản Nhân Viên Không Để Trống";
    return false;
  }
  if (!isNumber(account) || account.length < 4 || account.length > 6) {
    spanEl.style.display = "Block";
    spanEl.innerHTML = "Tài Khoản nhân viên nhập từ 4 đến 6 ký số!";
    return false;
  }

  if (!checkaccount(account)) {
    return false;
  }
  spanEl.style.display = "none";
  spanEl.innerHTML = "";
  return true;
}
/* Validate Tên Nhân Viên */
function validateName() {
  let name = dom("#name").value;
  let spanEl = dom("#tbTen");

  if (!name) {
    spanEl.style.display = "Block";
    spanEl.innerHTML = "Tên Nhân Viên Không Được Để Trống";
    return false;
  }
  let regex =
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/;
  if (!regex.test(name)) {
    spanEl.style.display = "Block";
    spanEl.innerHTML = "Tất cả phải là chữ!";
    return false;
  }
  spanEl.style.display = "none";
  spanEl.innerHTML = "";
  return true;
}
/* Validate Email */
function validateEmail() {
  let email = dom("#email").value;
  let spanEl = dom("#tbEmail");
  if (!email) {
    spanEl.style.display = "Block";
    spanEl.innerHTML = "Email Không Được Bỏ Trống";
    return false;
  }
  let regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!regex.test(email)) {
    spanEl.style.display = "Block";
    spanEl.innerHTML = "Email Sai Định Dạng";
    return false;
  }
  spanEl.style.display = "none";
  spanEl.innerHTML = "";
  return true;
}
/* Validate Mật Khẩu */
function validatePassword() {
  let password = dom("#password").value;
  let spanEl = dom("#tbMatKhau");

  if (!password) {
    spanEl.style.display = "Block";
    spanEl.innerHTML = "Mật Khẩu Không Được Để Trống";
  }
  let regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password) || password.length < 6 || password.length > 10) {
    spanEl.style.display = "Block";
    spanEl.innerHTML =
      "Mật khẩu từ 6 đến 10 kí tự trong đó bao gồm 1 kí tự in hoa, 1 kí tự thường, 1 kí tự số và 1 kí tự đặc biệt";
    return false;
  }
  spanEl.style.display = "none";
  spanEl.innerHTML = "";
  return true;
}
/* Validate Ngày Làm */
function validateWord() {
  let datewword = dom("#datepicker").value;
  let spanEl = dom("#tbNgay");

  if (!datewword) {
    spanEl.style.display = "Block";
    spanEl.innerHTML = "Ngày Tháng Không Được Để Trống";
    return false;
  }
  let regex = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/;
  if (!regex.test(datewword)) {
    spanEl.style.display = "Block";
    spanEl.innerHTML = "Ngày tháng theo định dạng mm/dd/yyyy";
    return false;
  }
  spanEl.style.display = "none";
  spanEl.innerHTML = "";
  return true;
}
/* Validate Lương Cơ Bản */
function validateSalary() {
  let salary = +dom("#luongCB").value;
  let spanEl = dom("#tbLuongCB");

  if (!salary) {
    spanEl.style.display = "Block";
    spanEl.innerHTML = "Lương cơ bản không được để trống";
    return false;
  }
  if (!isNumber(salary) || salary < 1000000 || salary > 20000000) {
    spanEl.style.display = "Block";
    spanEl.innerHTML = "Lương cơ bản từ 1.000.000 đến 20.000.000 Vnd";
    return false;
  }
  spanEl.style.display = "none";
  spanEl.innerHTML = "";
  return true;
}
/* Validate Chức Vụ */
function validatePosition() {
  let position = dom("#chucvu").value;
  let spanEl = dom("#tbChucVu");

  if (!position) {
    spanEl.style.display = "Block";
    spanEl.innerHTML = "Phải Chọn Đúng Chức Vụ, không được để trống";
    return false;
  }
  spanEl.style.display = "none";
  spanEl.innerHTML = "";
  return true;
}
/* Validate Thời Gian */
function validateTime() {
  let time = dom("#gioLam").value;
  let spanEl = dom("#tbGiolam");

  if (!time) {
    spanEl.style.display = "Block";
    spanEl.innerHTML = "Giờ Làm Việc Không Được Để Trống";
    return false;
  }
  if (time < 80 || time > 200) {
    spanEl.style.display = "Block";
    spanEl.innerHTML = "Giờ làm trong tháng quy định từ 80 giờ - 200 giờ";
    return false;
  }
  spanEl.style.display = "none";
  spanEl.innerHTML = "";
  return true;
}
/* Validate kiểm tra tài khoản có trùng nhau không */
function checkaccount(account) {
  let spanEl = dom("#tbTKNV");
  for (let i = 0; i < staffs.length; i++) {
    if (staffs[i].account == account) {
      spanEl.style.display = "Block";
      spanEl.innerHTML = "Tài Khoản đã tồn tại";
      return false;
    }
  }

  return true;
}

function validateForm() {
  let isValid = true;

  isValid = 
    validateId() &
    validateName() &
    validateEmail() &
    validatePassword() &
    validateWord() &
    validateSalary() &
    validatePosition() &
    validateTime();

  if (!isValid) {
    return false;
  }
  return true;
}

function isNumber(value) {
  return !isNaN(parseFloat(value)) && !isNaN(value - 0);
}
