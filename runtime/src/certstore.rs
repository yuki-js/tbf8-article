use core::convert::TryFrom;
use frame_support::{
    decl_event, decl_module, decl_storage,
    dispatch::{Decode, DispatchResult, Encode, Vec},
    ensure
};
use sp_core::{hash::{H256, H512}, Blake2Hasher, Hasher};
use sp_runtime::traits::Verify;
use sp_runtime::MultiSignature;
use system::ensure_signed;

pub trait Trait: system::Trait {
    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

type CertificateData = Vec<u8>;

#[derive(Decode, Encode, Clone, PartialEq, Default, Debug)]
pub struct Sig {
    // Signatureって名前を使うとバグるっぽい
    pub signature: H512,
    pub account_id: sp_runtime::AccountId32,
}

#[derive(Decode, Encode, Clone, PartialEq, Default)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Certificate {
    pub data: CertificateData,
    pub hash: H256,
    pub sigs: Vec<Sig>,
}

decl_storage! {
    trait Store for Module<T: Trait> as CertStore {
        /// 証明書のハッシュテーブル
        Certificates get(fn cert): map H256 => Certificate;

        /// 証明書ハッシュの配列
        CertificateArray: map u128 => H256;

        /// 証明書ハッシュ配列の要素数
        CertificateCount get(fn cert_count): u128;
    }
}

decl_event!(
    pub enum Event<T>
    where
        AccountId = <T as system::Trait>::AccountId,
    {
        /// 証明書が追加されました!
        CertAdded(AccountId, H256),
    }
);

decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        fn deposit_event() = default;

        /// 証明書追加
        pub fn add_cert(origin, data: CertificateData, sigs: Vec<Sig>) -> DispatchResult {
            ensure!(data.len() < 1024, "Certification is too large");
            ensure!(sigs.len() < 8, "Too many signers");
            
            let sender = ensure_signed(origin)?; // 署名済みトランザクションか?
            Self::check_cert(&data, &sigs)?;
            let hash = Blake2Hasher::hash(&data[..]); // ハッシュ値計算
            let cert = Certificate { // 構造体を用意
                data: data,
                sigs: sigs,
                hash: hash,
            };
            Self::insert_cert(hash, cert)?; 
            Self::deposit_event(RawEvent::CertAdded(sender, hash)); // イベント発行

            Ok(())
        }
    }
}

impl<T: Trait> Module<T> {
    /// 証明書をチェックする
    pub fn check_cert(cert: &CertificateData, sigs: &Vec<Sig>) -> DispatchResult {
        for sig in sigs.iter() {
            let s = MultiSignature::Sr25519(
                sp_core::sr25519::Signature::try_from(&sig.signature[..]).map_err(|_| "This is not a signature")?,
            );
            if !s.verify(&cert[..], &sig.account_id) { // 署名の検証
                return Err(sp_runtime::DispatchError::Other("Signature is invalid"));
            }
        }
        Ok(())
    }
    /// 証明書を記録する
    pub fn insert_cert(hash: H256, cert: Certificate) -> DispatchResult {
        Certificates::insert(hash, cert);
        let current_index = CertificateCount::get();
        CertificateArray::insert(current_index, hash);
        let next_index = current_index.checked_add(1).ok_or("index overflowed")?;
        CertificateCount::put(next_index);
        Ok(())
    }
}
