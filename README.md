# luci-wrqr

`luci-app-wrqr` adds a Wi-Fi QR widget to LuCI **Status → Overview**. It shows
one QR code for each distinct, active access-point configuration and merges
identical networks broadcast by multiple radios.

The widget reads fresh UCI and wireless runtime state on LuCI's normal status
poll. It does not restart Wi-Fi, rpcd, uhttpd or the router. Unsupported,
disabled and non-AP wireless interfaces are omitted.

## Compatibility

- OpenWrt 24.10: install the release IPK with `opkg`.
- OpenWrt 25.12: install the release APK from the shared Nikitid feed.

## Local checks

```sh
./scripts/ci-check.sh
```

Build an OpenWrt 25 APK with a compatible SDK:

```sh
OPENWRT_SDK_DIR=/path/to/openwrt-sdk-25.12.5-mediatek-filogic \
  ./scripts/build-apk.sh
```
