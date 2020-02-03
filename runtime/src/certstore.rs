use frame_support::{
    decl_event, decl_module, decl_storage,
    dispatch::{Decode, DispatchResult, Encode, Vec},
};
use sp_core::{hash::H256, Blake2Hasher, Hasher};
use system::ensure_signed;
pub trait Trait: system::Trait {
    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

type CertificateData = Vec<u8>;
type Sig = H256; // Signatureって名前を使うとバグるっぽい

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
            let sender = ensure_signed(origin)?;
            // some check

            let hash = Blake2Hasher::hash(&data[..]);
            let cert = Certificate {
                data: data,
                sigs: sigs,
                hash: hash.clone(),
            };
            Self::insert_cert(hash, cert)?;
            Self::deposit_event(RawEvent::CertAdded(sender, hash));
            Ok(())
        }
    }
}

impl<T: Trait> Module<T> {
    /// 証明書を記録する
    pub fn insert_cert(hash: H256, cert: Certificate) -> DispatchResult {
        Certificates::insert(&hash, cert);
        let current_index = CertificateCount::get();
        CertificateArray::insert(current_index, &hash);
        let next_index = current_index.checked_add(1).ok_or("index overflowed")?;
        CertificateCount::put(next_index);
        Ok(())
    }
}
