import firebaseConfig from "./firebaseApikey.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Create a root reference
const storage = getStorage();

// FirebaseAuthExceptionメッセージ一覧
// 登録時
const EMAIL_ALREADY_IN_USE = "auth/email-already-in-use";
const EMAIL_ALREADY_IN_USE_MESSAGE = "すでに登録されています。ログインしてください。";
const REGISTER_ERROR_MESSAGE = "アカウント登録に失敗しました。";
// ログイン時
const USER_NOT_FOUND = "auth/user-not-found";
const WRONG_PASSWORD = "auth/wrong-password";
const USER_WRONG_MESSAGE = "ユーザーが存在しない、またはパスワードが間違っています。";
const LOGIN_ERROR_MESSAGE = "ログインに失敗しました。";
// ログアウト
const LOGOUT_ERROR_MESSAGE = "ログアウトに失敗しました。";
// 画像アップロード
const UPLOAD_MESSAGE = "画像をアップロードしました。";
const UPLOAD_ERROR_MESSAGE = "画像のアップロードに失敗しました。";
const DOWNLOAD_ERROR_MESSAGE = "画像のダウンロードに失敗しました。";

// 新しいユーザーを登録する
// 登録ボタン押下時処理
register_btn.addEventListener('click', (e) => {
  // 規定の動作をキャンセル
  e.preventDefault();
  const email = document.getElementById('register_email_txt').value;
  const password = document.getElementById('register_pass_txt').value;
  createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
         // 登録成功
         // ログイン・登録エリアの非表示
         $("#login_register_area").css("display", "none");
         // 画像登録エリアの表示
         $("#image_input_area").css("display", "block");
         // Emailの表示
         $("#output_email").text(userCredential.user.email);
         // 画像ボタンにクラス付与
         $("#image_upload_btn").addClass("image_upload_color");
         $("#image_download_btn").addClass("image_download_color");
		})
		.catch((error) => {
         // 登録失敗
         if (error.code == EMAIL_ALREADY_IN_USE) {
            alert(EMAIL_ALREADY_IN_USE_MESSAGE);
         } else {
            alert(REGISTER_ERROR_MESSAGE);
         }
		});
});

// 既存のユーザーをログインさせる
// ログインボタン押下時処理
login_btn.addEventListener('click', (e) => {
  // 規定の動作をキャンセル
  e.preventDefault();
  const email = document.getElementById('login_email_txt').value;
  const password = document.getElementById('login_pass_txt').value;
  signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
         // ログイン成功
         // ログイン・登録エリアの非表示
         $("#login_register_area").css("display", "none");
         // 画像登録エリアの表示
         $("#image_input_area").css("display", "block");
         // Emailの表示
         $("#output_email").text(userCredential.user.email);
         // 画像ボタンにクラス付与
         $("#image_upload_btn").addClass("image_upload_color");
         $("#image_download_btn").addClass("image_download_color");
		})
		.catch((error) => {
         // ログイン失敗
         if (error.code == USER_NOT_FOUND || error.code == WRONG_PASSWORD) {
            alert(USER_WRONG_MESSAGE);
         } else {
            alert(LOGIN_ERROR_MESSAGE);
         }
		});
});

// ログアウトボタン押下時処理
logout_btn.addEventListener('click', (e) => {
   // 規定の動作をキャンセル
   e.preventDefault();
   signOut(auth)
      .then(() => {
         // ログアウト成功
         // ログイン・登録エリアの表示
         $("#login_register_area").css("display", "block");
         // 画像登録エリアの非表示
         $("#image_input_area").css("display", "none");
         // ギャラリーのクリア
         $("#gallery").html('');
      })
      .catch((err) => {
         // ログアウト失敗
         alert(LOGOUT_ERROR_MESSAGE);
      });
 });

 // 画像アップロードボタン押下時処理
 var form = document.querySelector('.image_input_form');
 form.addEventListener('submit', (e) => {
   // 規定の動作をキャンセル
   e.preventDefault();
   try {
      var imgs = form.querySelector('#input_file');
      for (var file of imgs.files) {
         var storageRef = ref(storage, 'form-uploaded/' + file.name);
         // 'file' comes from the Blob or File API
         uploadBytes(storageRef, file).then((snapshot) => {
            console.log(snapshot);
         });
      }
      alert(UPLOAD_MESSAGE);
   } catch(e) {
      alert(UPLOAD_ERROR_MESSAGE);
   }
 });

 // 画像ダウンロードボタン押下時処理
 image_download_btn.addEventListener('click', (e) => {
   // 規定の動作をキャンセル
   e.preventDefault();
   // ギャラリーのクリア
   $("#gallery").html('');
   // Create a reference under which you want to list
   const listRef = ref(storage, 'form-uploaded');
   // Find all the prefixes and items.
   listAll(listRef)
      .then((res) => {
      res.prefixes.forEach((folderRef) => {
         // All the prefixes under listRef.
         // You may call listAll() recursively on them.
      });
      res.items.forEach((itemRef) => {
         // 画像ダウンロード処理
         let arg = ref(storage, itemRef._location.path_);
         DownLoadImage(arg);
      });
      }).catch((error) => {
         alert(DOWNLOAD_ERROR_MESSAGE);
   });
 });

// 画像ダウンロード処理
function DownLoadImage(arg) {
   getDownloadURL(arg)
   .then((url) => {
      // This can be downloaded directly:
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
      const blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();

      // <img>要素の追加
      let h = '<img src="' + url + '" class="gallery_image">';
      $("#gallery").append(h);
   })
   .catch((error) => {
      alert(DOWNLOAD_ERROR_MESSAGE);
   });
}