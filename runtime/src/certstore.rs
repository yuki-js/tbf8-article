use frame_support::{
    decl_event, decl_module, decl_storage,
    dispatch::{Decode, DispatchResult, Encode, Vec},
};
use sp_core::{Blake2Hasher, Hasher, hash::H256};
use system::ensure_signed;
pub trait Trait: system::Trait {
    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

type CertificateData = Vec<u8>;
type Signature = [u8; 32];

#[derive(Decode, Encode, Clone, PartialEq, Default)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Certificate {
    pub data: CertificateData,
    pub hash: H256,
    pub sigs: Vec<Signature>
}

/// ストレージのデータ構造を作る
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
        /// 証明書が追加された時のイベント
        CertAdded(AccountId, H256),
    }
);

decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        fn deposit_event() = default;

        /// 証明書追加
        pub fn add_cert(origin, data: CertificateData, sigs: Vec<Signature>) -> DispatchResult {
            let sender = ensure_signed(origin)?;
            // some check
            let hash = Self::insert_cert(data, sigs)?;
            Self::deposit_event(RawEvent::CertAdded(sender, hash));
            Ok(())
        }
    }
}

impl<T: Trait> Module<T> {
    /// 証明書を記録する
    pub fn insert_cert(
        data: CertificateData,
        sigs: Vec<Signature>,
    ) -> Result<H256, &'static str> {
        let hash = Blake2Hasher::hash(&data[..]);
        Certificates::insert(
            &hash,
            Certificate {
                data: data,
                sigs: sigs,
                hash: hash.clone(),
            },
        );
        let current_index = CertificateCount::get();
        CertificateArray::insert(current_index, &hash);
        let next_index = current_index.checked_add(1).ok_or("index overflowed")?;
        CertificateCount::put(next_index);
        Ok(hash)
    }
}
